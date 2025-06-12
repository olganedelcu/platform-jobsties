
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ConversationService } from '@/services/conversationService';

export interface Conversation {
  id: string;
  mentee_id: string;
  coach_email: string;
  subject: string | null;
  status: 'active' | 'archived' | 'closed';
  created_at: string;
  updated_at: string;
  mentee_name?: string;
  last_message?: string;
  unread_count?: number;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      const userProfile = await ConversationService.getCurrentUserProfile();
      if (!userProfile) return;

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
  };

  const createConversation = async (subject: string) => {
    try {
      const userProfile = await ConversationService.getCurrentUserProfile();
      if (!userProfile) return null;

      const data = await ConversationService.createNewConversation(userProfile.user.id, subject);

      toast({
        title: "Success",
        description: "Conversation created successfully.",
      });

      await fetchConversations();
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
  };

  const updateConversationStatus = async (conversationId: string, status: 'active' | 'archived' | 'closed') => {
    try {
      await ConversationService.updateConversationStatus(conversationId, status);
      await fetchConversations();
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
  };

  useEffect(() => {
    fetchConversations();

    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, []);

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation,
    updateConversationStatus
  };
};
