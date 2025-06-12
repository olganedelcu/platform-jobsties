
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { SecureErrorHandler } from '@/utils/errorHandling';

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
  console.log('ConversationItem received conversation:', conversation);
  
  const { getConversationUnreadCount } = useNotificationContext();
  
  // Safely get unread count with fallback
  const unreadCount = conversation?.id ? getConversationUnreadCount(conversation.id) : 0;

  const formatTime = (timestamp: string) => {
    try {
      console.log('formatTime called with:', timestamp);
      
      if (!timestamp) {
        console.log('No timestamp provided');
        return 'Unknown time';
      }
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', timestamp);
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return 'just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) !== 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting time:', error, 'timestamp:', timestamp);
      return 'Unknown time';
    }
  };

  // Safely handle conversation data with fallbacks using SecureErrorHandler
  const safeConversation = {
    id: SecureErrorHandler.safeStringOperation(conversation?.id, 'trim', ''),
    subject: SecureErrorHandler.safeStringOperation(conversation?.subject, 'trim', 'Untitled Conversation'),
    coach_email: SecureErrorHandler.safeStringOperation(conversation?.coach_email, 'trim', 'Unknown Coach'),
    updated_at: SecureErrorHandler.safeStringOperation(conversation?.updated_at, 'trim', ''),
    latest_message: SecureErrorHandler.safeStringOperation(conversation?.latest_message, 'trim', '')
  };

  console.log('Safe conversation data:', safeConversation);

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
            <h3 className="font-medium text-gray-900">{safeConversation.subject}</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">with {safeConversation.coach_email}</p>
          {safeConversation.latest_message && (
            <p className="text-sm text-gray-600 truncate mt-1">{safeConversation.latest_message}</p>
          )}
        </div>
        <div className="text-xs text-gray-400 ml-4">
          {formatTime(safeConversation.updated_at)}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
