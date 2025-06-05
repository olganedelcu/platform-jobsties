
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Upload, Calendar, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CoachNavigationProps {
  user: any;
  onSignOut: () => void;
}

const CoachNavigation = ({ user, onSignOut }: CoachNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/coach/mentees', label: 'Mentees', icon: Users },
    { path: '/coach/cv-upload', label: 'CV Upload', icon: Upload },
    { path: '/coach/sessions', label: 'Sessions', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const handleProfileClick = () => {
    console.log('Navigating to coach profile');
    navigate('/coach/profile');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/09eb05af-ad26-4901-aafd-0d84888e4010.png" 
            alt="Jobsties Platform Logo" 
            className="h-12 w-auto"
            key="coach-logo"
          />
          <span className="ml-3 text-lg font-semibold text-gray-900">Coach Dashboard</span>
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
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                  </span>
                </div>
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
              <DropdownMenuItem className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
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

export default CoachNavigation;
