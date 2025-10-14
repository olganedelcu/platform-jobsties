import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems, settingsItems } from '@/config/studentNavigationConfig';
import CoachUserProfile from './CoachUserProfile';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface StudentMobileNavigationProps {
  user: any;
  onSignOut: () => void;
  onClose: () => void;
}

const StudentMobileNavigation = ({ user, onSignOut, onClose }: StudentMobileNavigationProps) => {
  const location = useLocation();

  const handleNavClick = (path: string) => {
    console.log('Mobile navigation to:', path);
    onClose();
  };

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {/* Mobile Notifications */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium text-gray-900">Notifications</span>
          <NotificationDropdown />
        </div>
        
        {/* Navigation Items */}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        {/* Settings Items */}
        <div className="border-t border-gray-200 pt-4">
          <div className="px-3 py-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Settings
            </span>
          </div>
          
          {settingsItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 pt-4">
          <CoachUserProfile user={user} onSignOut={onSignOut} />
        </div>
      </div>
    </div>
  );
};

export default StudentMobileNavigation;
