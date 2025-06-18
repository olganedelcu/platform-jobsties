
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '@/config/coachNavigationConfig';

const CoachDesktopNavigation = () => {
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // Don't prevent navigation, but ensure it's handled properly
    console.log('Navigating to:', path);
  };

  return (
    <div className="hidden md:flex md:items-center md:space-x-8">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default CoachDesktopNavigation;
