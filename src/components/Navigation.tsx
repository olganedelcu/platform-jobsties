
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
  MessageCircle,
  FileText,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import UserProfileSection from './UserProfileSection';
import MessageNotificationBadge from './messaging/MessageNotificationBadge';

interface NavigationProps {
  user: any;
  onSignOut: () => void;
}

const Navigation = ({ user, onSignOut }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/tracker', label: 'Tracker', icon: FileText },
    { path: '/messages', label: 'Communication', icon: MessageCircle },
    { path: '/course', label: 'Course', icon: BookOpen },
    { path: '/todos', label: 'Tasks', icon: FileText }
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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                alt="Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <DesktopNavigation navigationItems={navigationItems} />

          <div className="hidden md:flex md:items-center md:space-x-4">
            <UserProfileSection
              user={user}
              profilePicture={profilePicture}
              onSignOut={onSignOut}
              getInitials={getInitials}
            />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div className="relative">
              <Link
                to="/messages"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <MessageNotificationBadge />
              </Link>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
