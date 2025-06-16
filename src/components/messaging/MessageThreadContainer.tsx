
import React from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useConversations } from '@/hooks/useConversations';
import { useAuthState } from '@/hooks/useAuthState';
import MessageThread from './MessageThread';

interface MessageThreadContainerProps {
  conversationId: string | null;
}

const MessageThreadContainer = ({ conversationId }: MessageThreadContainerProps) => {
  const { user } = useAuthState();
  const { conversations } = useConversations();
  const { messages, loading, downloadAttachment } = useMessages(conversationId);

  const selectedConversation = conversations.find(c => c.id === conversationId);

  return (
    <MessageThread
      messages={messages}
      loading={loading}
      conversationSubject={selectedConversation?.subject || null}
      onDownloadAttachment={downloadAttachment}
      currentUserId={user?.id || null}
    />
  );
};

export default MessageThreadContainer;
