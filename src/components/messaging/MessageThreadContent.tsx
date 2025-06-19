
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, MessageAttachment } from '@/hooks/useMessages';
import MessageBubble from './MessageBubble';
import LoadMoreButton from './LoadMoreButton';

interface MessageThreadContentProps {
  messages: Message[];
  visibleMessages: Message[];
  hasMoreMessages: boolean;
  showLoadMore: boolean;
  currentUserId: string | null;
  onLoadMore: () => void;
  onDownloadAttachment: (attachment: MessageAttachment) => void;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages.length]);

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea 
        className="h-full [&>div>div[style]]:!block" 
        ref={scrollAreaRef}
        style={{
          '--scrollbar-size': '8px',
        } as React.CSSProperties}
      >
        <style jsx>{`
          .scroll-area-viewport {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
          .scroll-area-viewport::-webkit-scrollbar {
            width: 8px;
          }
          .scroll-area-viewport::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .scroll-area-viewport::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
        <div className="p-4 space-y-4">
          {hasMoreMessages && (
            <div className="text-center">
              <LoadMoreButton 
                show={true}
                hasMoreMessages={hasMoreMessages}
                totalMessages={messages.length}
                visibleMessagesCount={visibleMessages.length}
                onLoadMore={onLoadMore}
                variant="inline"
              />
            </div>
          )}
          
          {visibleMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === currentUserId}
              onDownloadAttachment={onDownloadAttachment}
            />
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageThreadContent;
