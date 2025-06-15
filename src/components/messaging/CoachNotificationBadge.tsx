
import React from 'react';
import { useInAppNotifications } from '@/hooks/useInAppNotifications';

const CoachNotificationBadge = () => {
  const { unreadCount } = useInAppNotifications();

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
};

export default CoachNotificationBadge;
