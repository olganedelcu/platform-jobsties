
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Calendar, FileText, MessageSquare, BookOpen, Target, Users, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationDropdown from '@/components/messaging/NotificationDropdown';

interface NavigationProps {
  user: any;
  onSignOut: () => void;
}

const Navigation = ({ user, onSignOut }: NavigationProps) => {
  const location = useLocation();
  const isCoach = user?.user_metadata?.role === 'COACH';

  const getInitials = (email: string) => {
    // Add safety checks for undefined/null email
    if (!email || typeof email !== 'string') {
      return 'U';
    }
    
    const emailParts = email.split('@');
    if (!emailParts[0]) {
      return 'U';
    }
    
    return emailParts[0].substring(0, 2).toUpperCase();
  };

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to={isCoach ? "/coach" : "/dashboard"} className="text-xl font-bold text-blue-600">
            Jobsties
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {isCoach ? (
              <>
                <Link to="/coach" className={getLinkClass('/coach')}>
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/coach/mentees" className={getLinkClass('/coach/mentees')}>
                  <Users className="h-4 w-4" />
                  Mentees
                </Link>
                <Link to="/coach/applications" className={getLinkClass('/coach/applications')}>
                  <FileText className="h-4 w-4" />
                  Applications
                </Link>
                <Link to="/coach/job-recommendations" className={getLinkClass('/coach/job-recommendations')}>
                  <Target className="h-4 w-4" />
                  Job Recommendations
                </Link>
                <Link to="/coach/sessions" className={getLinkClass('/coach/sessions')}>
                  <Calendar className="h-4 w-4" />
                  Sessions
                </Link>
                <Link to="/messages" className={getLinkClass('/messages')}>
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/tracker" className={getLinkClass('/tracker')}>
                  <FileText className="h-4 w-4" />
                  Job Tracker
                </Link>
                <Link to="/sessions" className={getLinkClass('/sessions')}>
                  <Calendar className="h-4 w-4" />
                  Sessions
                </Link>
                <Link to="/course" className={getLinkClass('/course')}>
                  <BookOpen className="h-4 w-4" />
                  Course
                </Link>
                <Link to="/messages" className={getLinkClass('/messages')}>
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          
          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {getInitials(user?.email || '')}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
