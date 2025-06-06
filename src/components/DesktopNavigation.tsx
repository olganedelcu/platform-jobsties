
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
    <div className="hidden md:flex md:items-center md:space-x-8">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            <IconComponent className="h-4 w-4 mr-2" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default DesktopNavigation;
