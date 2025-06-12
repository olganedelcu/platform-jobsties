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
  read_at: string | null;
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

      // First, get conversation details to know coach_email
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('coach_email')
        .eq('id', conversationId)
        .single();

      if (conversationError) {
        console.error('Error fetching conversation:', conversationError);
        return;
      }

      // Fetch the messages with read_at field
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive"
        });
        return;
      }

      // Then fetch the attachments for all messages
      const messageIds = messagesData?.map(msg => msg.id) || [];
      let attachmentsData = [];
      
      if (messageIds.length > 0) {
        const { data: attachments, error: attachmentsError } = await supabase
          .from('message_attachments')
          .select('*')
          .in('message_id', messageIds);

        if (!attachmentsError) {
          attachmentsData = attachments || [];
        }
      }

      // Get profiles for mentees and coach
      const senderIds = [...new Set(messagesData?.map(msg => msg.sender_id).filter(Boolean))];
      let profilesData = [];
      let coachProfile = null;

      if (senderIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, role')
          .in('id', senderIds);

        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Get coach profile by email if coach_email exists
      if (conversation.coach_email) {
        const { data: coach, error: coachError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, role')
          .eq('email', conversation.coach_email)
          .eq('role', 'COACH')
          .single();

        if (!coachError && coach) {
          coachProfile = coach;
        }
      }

      // Combine the data
      const formattedMessages = (messagesData || []).map((msg: any) => {
        let senderName = 'Unknown';
        
        if (msg.sender_type === 'coach' && coachProfile) {
          senderName = `${coachProfile.first_name} ${coachProfile.last_name}`;
        } else {
          const profile = profilesData.find(p => p.id === msg.sender_id);
          if (profile) {
            senderName = `${profile.first_name} ${profile.last_name}`;
          }
        }

        const messageAttachments = attachmentsData.filter(att => att.message_id === msg.id);

        return {
          ...msg,
          sender_name: senderName,
          attachments: messageAttachments
        };
      });

      setMessages(formattedMessages);

      // Mark messages as read and update read_at timestamp
      await markMessagesAsRead();
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!conversationId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();

      // Update messages to mark as read and set read_at timestamp
      await supabase
        .from('messages')
        .update({ 
          read_status: true,
          read_at: now
        })
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
