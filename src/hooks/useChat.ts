
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCoachService } from '@/hooks/useCoachService';
import { chatMessagesService } from '@/services/chatMessagesService';
import { chatNotificationService } from '@/services/chatNotificationService';

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
  const { getCoachId } = useCoachService();

  // Get Ana's user ID
  useEffect(() => {
    const fetchCoachId = async () => {
      const id = await getCoachId();
      setCoachId(id);
      setLoading(false);
    };

    fetchCoachId();
  }, [getCoachId]);

  // Fetch messages
  useEffect(() => {
    if (!coachId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      const fetchedMessages = await chatMessagesService.fetchMessages(userId, coachId);
      setMessages(fetchedMessages);
      setLoading(false);
    };

    fetchMessages();

    // Set up real-time subscription
    const unsubscribe = chatMessagesService.subscribeToMessages(
      userId, 
      coachId, 
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

    return unsubscribe;
  }, [userId, coachId]);

  const sendMessage = async (messageText: string) => {
    if (!coachId || !messageText.trim()) {
      if (!coachId) {
        toast({
          title: "Coach not available",
          description: "Ana is not available for chat at the moment. Please try again later.",
          variant: "destructive"
        });
      }
      return;
    }

    const success = await chatMessagesService.sendMessage(userId, coachId, messageText);
    
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return;
    }

    // Send email notification
    await chatNotificationService.sendEmailNotification(messageText);
  };

  return {
    messages,
    loading,
    sendMessage,
    coachId
  };
};
