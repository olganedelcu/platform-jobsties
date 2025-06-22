import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  MessageSquare,
  FileText,
  BookOpen,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import UserProfileSection from './UserProfileSection';
import NotificationDropdown from './notifications/NotificationDropdown';

interface NavigationProps {
  user: any;
  onSignOut: () => void;
}

const Navigation = ({ user, onSignOut }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/course', label: 'Course', icon: BookOpen },
    { path: '/tracker', label: 'Tracker', icon: FileText },
    { path: '/sessions', label: 'Sessions', icon: Calendar },
    { path: '/todos', label: 'Tasks', icon: FileText },
    { path: '/messages', label: 'Chat', icon: MessageSquare }
  ];

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('profile_picture_url')
            .eq('user_id', user.id)
            .single();
          
          if (data?.profile_picture_url && !error) {
            setProfilePicture(data.profile_picture_url);
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      }
    };

    fetchProfilePicture();
  }, [user?.id]);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}` || 'U';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="/lovable-uploads/187c9aad-b772-4ca0-99ab-6bd2978bb1c2.png" 
                alt="Platform Logo" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <DesktopNavigation navigationItems={navigationItems} />

          <div className="hidden md:flex md:items-center md:space-x-6">
            <NotificationDropdown />
            <UserProfileSection
              user={user}
              profilePicture={profilePicture}
              onSignOut={onSignOut}
              getInitials={getInitials}
            />
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <MobileNavigation
        isOpen={mobileMenuOpen}
        navigationItems={navigationItems}
        user={user}
        profilePicture={profilePicture}
        onSignOut={onSignOut}
        onClose={() => setMobileMenuOpen(false)}
        getInitials={getInitials}
      />
    </nav>
  );
};

export default Navigation;
