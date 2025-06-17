
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { navItems, settingsItems } from '@/config/coachNavigationConfig';

interface CoachMobileNavigationProps {
  user: any;
  onSignOut: () => void;
  onClose: () => void;
}

const CoachMobileNavigation = ({ user, onSignOut, onClose }: CoachMobileNavigationProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        {[...navItems, ...settingsItems].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={onClose}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div className="px-3 py-2 border-t mt-4">
          <div className="text-sm text-gray-600 mb-2">
            {user?.user_metadata?.first_name || user?.email}
          </div>
          <Button onClick={onSignOut} variant="ghost" size="sm" className="w-full justify-start">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachMobileNavigation;
