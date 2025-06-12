
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConversationService } from '@/services/conversationService';
import { Conversation } from './useConversations';

export const useConversationsFetch = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      
      const userProfile = await ConversationService.getCurrentUserProfile();
      if (!userProfile) {
        setLoading(false);
        return;
      }

      const { user, profile } = userProfile;
      const conversationsData = await ConversationService.fetchConversationsData(user.id, profile?.role || 'MENTEE');
      const formattedConversations = await ConversationService.formatConversations(conversationsData, user.id);

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    conversations,
    loading,
    fetchConversations,
    setConversations
  };
};
