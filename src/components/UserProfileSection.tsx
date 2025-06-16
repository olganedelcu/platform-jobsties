
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

interface UserProfileSectionProps {
  user: any;
  profilePicture: string | null;
  onSignOut: () => void;
  getInitials: (firstName: string, lastName: string) => string;
}

const UserProfileSection = ({
  user,
  profilePicture,
  onSignOut,
  getInitials
}: UserProfileSectionProps) => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      <Link
        to="/profile"
        className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
      >
        <Avatar className="h-10 w-10 ring-2 ring-blue-100">
          <AvatarImage src={profilePicture || undefined} />
          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium">
            {getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
          </span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
      </Link>
      
      <Button
        variant="ghost"
        onClick={onSignOut}
        className="flex items-center text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-2xl transition-colors"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default UserProfileSection;
