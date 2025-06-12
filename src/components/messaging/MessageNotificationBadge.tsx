
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

const MessageNotificationBadge = () => {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default MessageNotificationBadge;
