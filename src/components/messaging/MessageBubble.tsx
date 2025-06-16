
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Bot } from 'lucide-react';
import { Message } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import MessageAttachment from './MessageAttachment';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onDownloadAttachment: (attachment: any) => void;
}

const MessageBubble = ({ message, isCurrentUser, onDownloadAttachment }: MessageBubbleProps) => {
  const isCoach = message.sender_type === 'coach';

  return (
    <div
      className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-1.5 py-1 rounded-lg break-words overflow-wrap-anywhere shadow-sm ${
          isCurrentUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : isCoach
            ? 'bg-purple-50 text-purple-900 border border-purple-200 rounded-bl-sm'
            : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-sm'
        }`}
      >
        <div className="flex items-center gap-1 mb-1">
          {isCoach ? (
            <Bot className="h-3 w-3 flex-shrink-0" />
          ) : (
            <User className="h-3 w-3 flex-shrink-0" />
          )}
          <span className="text-[10px] font-medium">
            {isCurrentUser ? 'You' : message.sender_name || 'Unknown'}
          </span>
          {isCoach && (
            <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-purple-100 text-purple-700">
              Coach
            </Badge>
          )}
        </div>
        
        <p className="text-xs leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere mb-1">{message.content}</p>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-1 space-y-1">
            {message.attachments.map((attachment) => (
              <MessageAttachment
                key={attachment.id}
                attachment={attachment}
                isCurrentUser={isCurrentUser}
                onDownload={onDownloadAttachment}
              />
            ))}
          </div>
        )}
        
        <div className="mt-1 text-right">
          <span
            className={`text-[9px] ${
              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
