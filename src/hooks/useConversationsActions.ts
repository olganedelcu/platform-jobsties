
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConversationService } from '@/services/conversationService';

export const useConversationsActions = (onConversationsUpdated: () => void) => {
  const { toast } = useToast();

  const createConversation = useCallback(async (subject: string) => {
    try {
      const userProfile = await ConversationService.getCurrentUserProfile();
      if (!userProfile) return null;

      const data = await ConversationService.createNewConversation(userProfile.user.id, subject);

      toast({
        title: "Success",
        description: "Conversation created successfully.",
      });

      await onConversationsUpdated();
      return data;
    } catch (error) {
      console.error('Error in createConversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation.",
        variant: "destructive"
      });
      return null;
    }
  }, [toast, onConversationsUpdated]);

  const updateConversationStatus = useCallback(async (conversationId: string, status: 'active' | 'archived' | 'closed') => {
    try {
      await ConversationService.updateConversationStatus(conversationId, status);
      await onConversationsUpdated();
      toast({
        title: "Success",
        description: "Conversation status updated.",
      });
    } catch (error) {
      console.error('Error in updateConversationStatus:', error);
      toast({
        title: "Error",
        description: "Failed to update conversation status.",
        variant: "destructive"
      });
    }
  }, [toast, onConversationsUpdated]);

  return {
    createConversation,
    updateConversationStatus
  };
};
