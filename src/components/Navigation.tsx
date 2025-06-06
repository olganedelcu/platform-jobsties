
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  MessageCircle
} from 'lucide-react';

interface NavigationProps {
  user: any;
  onSignOut: () => void;
}

const Navigation = ({ user, onSignOut }: NavigationProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: any) => {
      if (event.detail?.profilePicture) {
        setProfilePicture(event.detail.profilePicture);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/course', label: 'Course', icon: BookOpen },
    { path: '/sessions', label: 'Sessions', icon: Calendar },
    { path: '/tracker', label: 'Tracker', icon: BarChart3 },
    { path: '/chat', label: 'Chat', icon: MessageCircle },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                alt="JobSties Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* User Profile Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profilePicture || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs">
                  {getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
            
            <Link
              to="/profile"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/profile'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="text-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex items-center space-x-3 px-3 py-2 mb-4">
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
            </div>
            
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
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
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/profile'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
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
      </div>
    </nav>
  );
};

export default Navigation;
