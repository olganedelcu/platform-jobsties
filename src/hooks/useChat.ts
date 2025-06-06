
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export const useChat = (userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [coachId, setCoachId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get Ana's user ID
  useEffect(() => {
    const getCoachId = async () => {
      try {
        console.log('Looking for Ana coach profile...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', 'ana@jobsties.com')
          .single();

        if (error) {
          console.error('Error fetching coach:', error);
          // If Ana's profile doesn't exist, we'll create a placeholder
          // In a real app, Ana would need to sign up first
          setLoading(false);
          return;
        }

        console.log('Found Ana coach profile:', data);
        setCoachId(data.id);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    getCoachId();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!coachId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log('Fetching messages between:', userId, 'and', coachId);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${coachId}),and(sender_id.eq.${coachId},receiver_id.eq.${userId})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        console.log('Fetched messages:', data);
        setMessages(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `or(and(sender_id.eq.${userId},receiver_id.eq.${coachId}),and(sender_id.eq.${coachId},receiver_id.eq.${userId}))`
        },
        (payload) => {
          console.log('Real-time message received:', payload);
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, coachId]);

  const sendMessage = async (messageText: string) => {
    if (!coachId || !messageText.trim()) {
      if (!coachId) {
        toast({
          title: "Coach not available",
          description: "Ana is not available for chat at the moment.",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      console.log('Sending message:', messageText);
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: userId,
          receiver_id: coachId,
          message: messageText.trim()
        });

      if (error) {
        throw error;
      }

      // Send email notification to Ana
      try {
        // Get user details for the email
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.functions.invoke('send-chat-notification', {
          body: {
            menteeEmail: user?.email,
            menteeName: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim(),
            message: messageText.trim()
          }
        });
        console.log('Email notification sent to Ana');
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't show error to user as the message was still sent
      }

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    coachId
  };
};
