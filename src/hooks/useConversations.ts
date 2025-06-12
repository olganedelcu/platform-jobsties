
import React, { useCallback } from 'react';
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

  // Initialize conversations on mount
  React.useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation,
    updateConversationStatus
  };
};
