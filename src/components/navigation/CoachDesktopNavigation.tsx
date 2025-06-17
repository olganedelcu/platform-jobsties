
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { navItems, settingsItems } from '@/config/coachNavigationConfig';

const CoachDesktopNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isSettingsActive = () => settingsItems.some(item => isActive(item.path));

  return (
    <div className="hidden md:flex items-center space-x-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
      
      {/* Settings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isSettingsActive()
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.path} asChild>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 w-full ${
                    isActive(item.path) ? 'bg-indigo-50 text-indigo-700' : ''
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CoachDesktopNavigation;
