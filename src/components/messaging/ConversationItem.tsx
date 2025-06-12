
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useConversationNotifications } from '@/hooks/useConversationNotifications';

interface ConversationItemProps {
  conversation: {
    id: string;
    subject: string;
    coach_email: string;
    updated_at: string;
    latest_message?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  const { unreadCount } = useConversationNotifications(conversation.id);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{conversation.subject}</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">with {conversation.coach_email}</p>
          {conversation.latest_message && (
            <p className="text-sm text-gray-600 truncate mt-1">{conversation.latest_message}</p>
          )}
        </div>
        <div className="text-xs text-gray-400 ml-4">
          {formatTime(conversation.updated_at)}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
