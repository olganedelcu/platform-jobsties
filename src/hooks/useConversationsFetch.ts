
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ConversationService } from '@/services/conversationService';
import { Conversation } from './useConversations';

export const useConversationsFetch = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token || !session?.refresh_token) return false;
      
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  const fetchConversations = useCallback(async () => {
    const isValidSession = await validateSession();
    if (!isValidSession) {
      console.log('No valid session, skipping conversation fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const userProfile = await ConversationService.getCurrentUserProfile();
      if (!userProfile?.user?.id) {
        console.log('No user profile found, user not authenticated');
        setLoading(false);
        return;
      }

      console.log('Fetching conversations for authenticated user:', userProfile.user.id);
      const { user, profile } = userProfile;
      
      const userRole = profile?.role || 'MENTEE';
      
      const conversationsData = await ConversationService.fetchConversationsData(user.id, userRole);
      const formattedConversations = await ConversationService.formatConversations(conversationsData, user.id);

      setConversations(formattedConversations || []);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
      
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive"
      });
      setConversations([]);
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
