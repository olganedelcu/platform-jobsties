
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
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
    </Button>
  );
};

export default NotificationDropdown;
