
import React, { useEffect, useState, useCallback } from 'react';
import { Message, MessageAttachment } from '@/hooks/useMessages';
import MessageThreadHeader from './MessageThreadHeader';
import MessageThreadContent from './MessageThreadContent';
import MessageThreadSkeleton from './MessageThreadSkeleton';
import EmptyMessageState from './EmptyMessageState';

interface MessageThreadProps {
  messages: Message[];
  loading: boolean;
  conversationSubject: string | null;
  onDownloadAttachment: (attachment: MessageAttachment) => void;
  currentUserId: string | null;
}

const MESSAGES_PER_PAGE = 5;

const MessageThread = ({
  messages,
  loading,
  conversationSubject,
  onDownloadAttachment,
  currentUserId
}: MessageThreadProps) => {
  const [visibleMessagesCount, setVisibleMessagesCount] = useState(MESSAGES_PER_PAGE);
  const [showLoadMore, setShowLoadMore] = useState(false);

  // Get the messages to display (most recent ones)
  const visibleMessages = messages.slice(-visibleMessagesCount);
  const hasMoreMessages = messages.length > visibleMessagesCount;

  const loadMoreMessages = () => {
    const newCount = Math.min(visibleMessagesCount + MESSAGES_PER_PAGE, messages.length);
    setVisibleMessagesCount(newCount);
  };

  const handleScroll = useCallback(() => {
    // This would be implemented in the content component
    // Show load more button when scrolled near the top
    if (hasMoreMessages) {
      setShowLoadMore(true);
    } else {
      setShowLoadMore(false);
    }
  }, [hasMoreMessages]);

  // Reset visible messages count when conversation changes
  useEffect(() => {
    setVisibleMessagesCount(MESSAGES_PER_PAGE);
    setShowLoadMore(false);
  }, [messages.length === 0]);

  if (loading) {
    return <MessageThreadSkeleton />;
  }

  if (messages.length === 0) {
    return <EmptyMessageState conversationSubject={conversationSubject} />;
  }

  return (
    <div className="h-full flex flex-col">
      <MessageThreadHeader
        conversationSubject={conversationSubject}
        hasMoreMessages={hasMoreMessages}
        visibleMessagesCount={visibleMessagesCount}
        totalMessages={messages.length}
      />
      
      <MessageThreadContent
        messages={messages}
        visibleMessages={visibleMessages}
        hasMoreMessages={hasMoreMessages}
        showLoadMore={showLoadMore}
        currentUserId={currentUserId}
        onLoadMore={loadMoreMessages}
        onDownloadAttachment={onDownloadAttachment}
        onScrollHandler={handleScroll}
      />
    </div>
  );
};

export default MessageThread;
