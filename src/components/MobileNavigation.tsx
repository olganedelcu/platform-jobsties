
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LucideIcon, LogOut } from 'lucide-react';
import MessageNotificationBadge from './messaging/MessageNotificationBadge';

interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavigationProps {
  isOpen: boolean;
  navigationItems: NavigationItem[];
  user: any;
  profilePicture: string | null;
  onSignOut: () => void;
  onClose: () => void;
  getInitials: (firstName?: string, lastName?: string) => string;
}

const MobileNavigation = ({
  isOpen,
  navigationItems,
  user,
  profilePicture,
  onSignOut,
  onClose,
  getInitials
}: MobileNavigationProps) => {
  if (!isOpen) return null;

  // Add safety checks for user data
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const email = user?.email || '';

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isMessages = item.path === '/messages';
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 relative"
              onClick={onClose}
            >
              <IconComponent className="h-5 w-5" />
              <span>{item.label}</span>
              {isMessages && <MessageNotificationBadge />}
            </Link>
          );
        })}
        
        <div className="px-3 py-2 border-t mt-4">
          <Link
            to="/profile"
            className="flex items-center space-x-3 mb-3"
            onClick={onClose}
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
            onClick={onSignOut}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-700 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
