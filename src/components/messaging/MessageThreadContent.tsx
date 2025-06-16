
import React, { useEffect, useRef, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/hooks/useMessages';
import MessageBubble from './MessageBubble';
import LoadMoreButton from './LoadMoreButton';

interface MessageThreadContentProps {
  messages: Message[];
  visibleMessages: Message[];
  hasMoreMessages: boolean;
  showLoadMore: boolean;
  currentUserId: string | null;
  onLoadMore: () => void;
  onDownloadAttachment: (attachment: any) => void;
  onScrollHandler: () => void;
}

const MessageThreadContent = ({
  messages,
  visibleMessages,
  hasMoreMessages,
  showLoadMore,
  currentUserId,
  onLoadMore,
  onDownloadAttachment,
  onScrollHandler
}: MessageThreadContentProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when new messages arrive (but only if we're showing recent messages)
  useEffect(() => {
    if (messages.length > 0 && visibleMessages.length >= messages.length - 5) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, visibleMessages.length]);

  // Scroll to bottom on initial load
  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex-1 min-h-0 relative">
      <LoadMoreButton
        show={showLoadMore}
        hasMoreMessages={hasMoreMessages}
        totalMessages={messages.length}
        visibleMessagesCount={visibleMessages.length}
        onLoadMore={onLoadMore}
        variant="floating"
      />
      
      <ScrollArea className="h-full [&>div>div[style]]:!block">
        <div 
          ref={scrollContainerRef}
          className="p-2 min-h-full flex flex-col"
          onScroll={onScrollHandler}
        >
          <div className="flex-1"></div>
          <div className="space-y-1">
            <LoadMoreButton
              show={true}
              hasMoreMessages={hasMoreMessages}
              totalMessages={messages.length}
              visibleMessagesCount={visibleMessages.length}
              onLoadMore={onLoadMore}
              variant="inline"
            />
            
            {visibleMessages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={isCurrentUser}
                  onDownloadAttachment={onDownloadAttachment}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageThreadContent;
