import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Calendar, BarChart, LogOut, User, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

interface NavigationProps {
  user: any;
  onSignOut: () => void;
}

const Navigation = ({ user, onSignOut }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/course', label: 'Course', icon: BookOpen },
    { path: '/tracker', label: 'Tracker', icon: BarChart },
    { path: '/sessions', label: 'Sessions', icon: Calendar },
  ];

  // Fetch user profile picture
  const fetchProfilePicture = async () => {
    if (user?.id) {
      try {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('profile_picture_url')
          .eq('user_id', user.id)
          .single();

        if (userProfile?.profile_picture_url) {
          setProfilePicture(userProfile.profile_picture_url);
        } else {
          setProfilePicture(null);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setProfilePicture(null);
      }
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [user?.id]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      const { profilePicture: updatedPicture } = event.detail;
      setProfilePicture(updatedPicture);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleProfileClick = () => {
    console.log('Navigating to profile');
    navigate('/profile');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/09eb05af-ad26-4901-aafd-0d84888e4010.png" 
            alt="Jobsties Platform Logo" 
            className="h-12 w-auto"
            key="main-logo"
          />
        </div>
        
        <div className="flex justify-center flex-1">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                  className={`flex items-center space-x-2 cursor-pointer ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                    </span>
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  handleProfileClick();
                }} 
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              onSignOut();
            }}
            className="text-gray-700 border-gray-300 hover:bg-gray-50 p-2"
            size="icon"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
