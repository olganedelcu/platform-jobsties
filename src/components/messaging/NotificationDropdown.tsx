
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate('/coach/messages');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="relative"
      onClick={handleNotificationClick}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationDropdown;
