import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ConversationService } from '@/services/conversationService';
import { Conversation } from './useConversations';
import { SecureErrorHandler } from '@/utils/errorHandling';

export const useConversationsFetch = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token || !session?.refresh_token) return false;
      
      // Check if session is expired
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
    // Validate authentication before proceeding
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
      
      // Keep role in uppercase to match database format
      const userRole = SecureErrorHandler.safeStringOperation(profile?.role, 'toUpperCase', 'MENTEE');
      
      const conversationsData = await ConversationService.fetchConversationsData(user.id, userRole);
      const formattedConversations = await ConversationService.formatConversations(conversationsData, user.id);

      setConversations(SecureErrorHandler.safeArrayOperation(formattedConversations, []));
    } catch (error) {
      console.error('Error in fetchConversations:', error);
      const sanitizedError = SecureErrorHandler.handleError(error, {
        component: 'useConversationsFetch',
        action: 'fetchConversations'
      });
      
      toast({
        title: "Error",
        description: sanitizedError.message,
        variant: "destructive"
      });
      // Set empty array on error to prevent further crashes
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
