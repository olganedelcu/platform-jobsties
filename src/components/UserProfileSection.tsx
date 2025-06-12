
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
  // Add safety checks for user data
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const email = user?.email || '';

  return (
    <div className="hidden md:flex md:items-center md:space-x-4">
      <Link
        to="/profile"
        className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={profilePicture || undefined} />
          <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {firstName} {lastName}
          </span>
          <span className="text-xs text-gray-500">{email}</span>
        </div>
      </Link>
      
      <Button
        variant="ghost"
        onClick={onSignOut}
        className="flex items-center text-gray-700 hover:text-red-600"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default UserProfileSection;
