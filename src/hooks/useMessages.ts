
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'mentee' | 'coach';
  content: string;
  message_type: 'text' | 'system';
  read_status: boolean;
  created_at: string;
  sender_name?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  uploaded_at: string;
}

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          message_attachments(*),
          profiles!messages_sender_id_fkey(first_name, last_name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive"
        });
        return;
      }

      const formattedMessages = (data || []).map((msg: any) => {
        const sender = msg.profiles;
        const senderName = sender ? `${sender.first_name} ${sender.last_name}` : 'Unknown';

        return {
          ...msg,
          sender_name: senderName,
          attachments: msg.message_attachments || []
        };
      });

      setMessages(formattedMessages);

      // Mark messages as read
      await markMessagesAsRead();
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!conversationId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('messages')
        .update({ read_status: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('read_status', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!conversationId || !content.trim()) return;

    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile to determine sender type
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const senderType = profile?.role === 'COACH' ? 'coach' : 'mentee';

      // Insert message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          sender_type: senderType,
          content: content.trim(),
          message_type: 'text'
        })
        .select()
        .single();

      if (messageError) {
        console.error('Error sending message:', messageError);
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive"
        });
        return;
      }

      // Handle file attachments if any
      if (attachments && attachments.length > 0) {
        await uploadAttachments(message.id, attachments);
      }

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      await fetchMessages();
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const uploadAttachments = async (messageId: string, files: File[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message-attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          throw uploadError;
        }

        // Save attachment record
        const { error: attachmentError } = await supabase
          .from('message_attachments')
          .insert({
            message_id: messageId,
            file_name: file.name,
            file_path: uploadData.path,
            file_type: file.type,
            file_size: file.size
          });

        if (attachmentError) {
          console.error('Error saving attachment record:', attachmentError);
          throw attachmentError;
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading attachments:', error);
      toast({
        title: "Warning",
        description: "Message sent but some attachments failed to upload.",
        variant: "destructive"
      });
    }
  };

  const downloadAttachment = async (attachment: MessageAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .download(attachment.file_path);

      if (error) {
        console.error('Error downloading attachment:', error);
        toast({
          title: "Error",
          description: "Failed to download attachment.",
          variant: "destructive"
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error in downloadAttachment:', error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();

      // Set up real-time subscription for messages
      const messagesChannel = supabase
        .channel(`messages-${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    sending,
    fetchMessages,
    sendMessage,
    downloadAttachment
  };
};
