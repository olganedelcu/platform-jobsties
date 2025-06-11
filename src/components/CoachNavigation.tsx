
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Users, 
  MessageSquare, 
  Settings, 
  BookOpen, 
  FileUp, 
  User,
  Menu,
  X,
  CheckSquare,
  BarChart3
} from 'lucide-react';

interface CoachNavigationProps {
  user: any;
  onSignOut: () => void;
}

const CoachNavigation = ({ user, onSignOut }: CoachNavigationProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      path: '/coach/mentees', 
      label: 'Mentees', 
      icon: Users 
    },
    { 
      path: '/coach/applications', 
      label: 'Applications', 
      icon: BarChart3 
    },
    { 
      path: '/coach/sessions', 
      label: 'Sessions', 
      icon: BookOpen 
    },
    { 
      path: '/coach/calendar', 
      label: 'Calendar', 
      icon: Calendar 
    },
    { 
      path: '/coach/chat', 
      label: 'Messages', 
      icon: MessageSquare 
    },
    { 
      path: '/coach/cv-upload', 
      label: 'CV Upload', 
      icon: FileUp 
    },
    { 
      path: '/coach/todos', 
      label: 'Tasks', 
      icon: CheckSquare 
    },
    { 
      path: '/coach/profile', 
      label: 'Profile', 
      icon: User 
    },
    { 
      path: '/coach/settings', 
      label: 'Settings', 
      icon: Settings 
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/coach/mentees" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Ana Coach Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.slice(0, 6).map((item) => {
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
            
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
              <span className="text-sm text-gray-600">
                {user?.user_metadata?.first_name || user?.email}
              </span>
              <Button onClick={onSignOut} variant="ghost" size="sm">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="px-3 py-2 border-t mt-4">
              <div className="text-sm text-gray-600 mb-2">
                {user?.user_metadata?.first_name || user?.email}
              </div>
              <Button onClick={onSignOut} variant="ghost" size="sm" className="w-full justify-start">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CoachNavigation;
