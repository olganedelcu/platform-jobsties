
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, MessageCircle } from 'lucide-react';
import MessageNotificationBadge from './messaging/MessageNotificationBadge';
import { useNotifications } from '@/hooks/useNotifications';

interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface DesktopNavigationProps {
  navigationItems: NavigationItem[];
}

const DesktopNavigation = ({ navigationItems }: DesktopNavigationProps) => {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <div className="hidden md:flex md:items-center md:space-x-8">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isMessages = item.path === '/messages';
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
              location.pathname === item.path
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            <IconComponent className="h-4 w-4 mr-2" />
            {item.label}
            {isMessages && unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default DesktopNavigation;
