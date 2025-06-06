
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, LogOut, LucideIcon } from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  user: any;
  profilePicture: string | null;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onSignOut: () => void;
  getInitials: (firstName: string, lastName: string) => string;
}

const MobileNavigation = ({
  navigationItems,
  user,
  profilePicture,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onSignOut,
  getInitials
}: MobileNavigationProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <Button
          variant="ghost"
          onClick={onToggleMobileMenu}
          className="text-gray-700"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4">
          <Link
            to="/profile"
            onClick={() => onToggleMobileMenu()}
            className="flex items-center space-x-3 px-3 py-2 mb-4 hover:bg-gray-50 rounded-md transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={profilePicture || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                {getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </Link>
          
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onToggleMobileMenu()}
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
            
            <Button
              variant="ghost"
              onClick={onSignOut}
              className="w-full justify-start text-gray-700 hover:text-red-600 px-3 py-2"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
