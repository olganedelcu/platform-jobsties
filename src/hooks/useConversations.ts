
import { useCallback, useEffect, useMemo } from 'react';
import { useConversationsFetch } from './useConversationsFetch';
import { useConversationsActions } from './useConversationsActions';
import { useConversationsRealtime } from './useConversationsRealtime';

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
  const {
    conversations,
    loading,
    fetchConversations
  } = useConversationsFetch();

  const handleConversationsUpdated = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  const {
    createConversation,
    updateConversationStatus
  } = useConversationsActions(handleConversationsUpdated);

  useConversationsRealtime(handleConversationsUpdated);

  // Initialize conversations on mount - only once
  useEffect(() => {
    fetchConversations();
  }, []); // Empty dependency array to prevent infinite loops

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    conversations,
    loading,
    fetchConversations,
    createConversation,
    updateConversationStatus
  }), [conversations, loading, fetchConversations, createConversation, updateConversationStatus]);

  return returnValue;
};
