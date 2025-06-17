
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

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

  return (
    <div className="hidden md:flex md:items-center md:space-x-1">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative min-w-0 ${
              isActive
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <IconComponent className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default DesktopNavigation;
