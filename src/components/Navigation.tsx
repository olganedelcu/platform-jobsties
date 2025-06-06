
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  BarChart3, 
  MessageCircle
} from 'lucide-react';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import UserProfileSection from './UserProfileSection';

interface NavigationProps {
  user: any;
  onSignOut: () => void;
}

const Navigation = ({ user, onSignOut }: NavigationProps) => {
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

          <DesktopNavigation navigationItems={navigationItems} />

          <UserProfileSection
            user={user}
            profilePicture={profilePicture}
            onSignOut={onSignOut}
            getInitials={getInitials}
          />

          <MobileNavigation
            navigationItems={navigationItems}
            user={user}
            profilePicture={profilePicture}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={toggleMobileMenu}
            onSignOut={onSignOut}
            getInitials={getInitials}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
