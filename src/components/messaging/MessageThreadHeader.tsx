
import React from 'react';
import { User } from 'lucide-react';

interface MessageThreadHeaderProps {
  conversationSubject: string | null;
  hasMoreMessages: boolean;
  visibleMessagesCount: number;
  totalMessages: number;
}

const MessageThreadHeader = ({
  conversationSubject,
  hasMoreMessages,
  visibleMessagesCount,
  totalMessages
}: MessageThreadHeaderProps) => {
  return (
    <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-4">
      <div className="flex items-center gap-2 text-gray-900 font-medium">
        <User className="h-5 w-5" />
        {conversationSubject || 'Conversation'}
        {hasMoreMessages && (
          <span className="text-xs text-gray-500">
            ({visibleMessagesCount} of {totalMessages})
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageThreadHeader;
