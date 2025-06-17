
import React from 'react';
import { Button } from '@/components/ui/button';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface CoachUserProfileProps {
  user: any;
  onSignOut: () => void;
}

const CoachUserProfile = ({ user, onSignOut }: CoachUserProfileProps) => {
  return (
    <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
      <NotificationDropdown />
      <span className="text-sm text-gray-600">
        {user?.user_metadata?.first_name || user?.email}
      </span>
      <Button onClick={onSignOut} variant="ghost" size="sm">
        Sign Out
      </Button>
    </div>
  );
};

export default CoachUserProfile;
