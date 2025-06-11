
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User, 
  Play, 
  TrendingUp 
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import DashboardQuickLinks from '@/components/DashboardQuickLinks';
import { useNavigate } from 'react-router-dom';

interface DashboardContentProps {
  user: any;
}

const DashboardContent = ({ user }: DashboardContentProps) => {
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || 'User';
  const { courseProgress } = useDashboardData(user?.id || '');
  const { applications } = useJobApplicationsData(user);
  
  // Calculate applications this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const applicationsThisMonth = applications.filter(app => 
    new Date(app.date_applied) >= firstDayOfMonth
  ).length;

  const handleCVOptimizedClick = () => {
    navigate('/course');
  };

  const handleInterviewPrepClick = () => {
    navigate('/course');
  };

  const handleSalaryNegotiationClick = () => {
    navigate('/course');
  };
  
  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good morning, {firstName}
            </h1>
            <p className="text-gray-500 text-lg">Ready to accelerate your career journey?</p>
          </div>
          <Avatar className="h-14 w-14">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={firstName} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
              <User className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Quick Links */}
      <DashboardQuickLinks />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Career Progress */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Career Progress</h3>
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Live
                </Badge>
              </div>
              
              <div className="text-4xl font-bold text-blue-600 mb-3">{courseProgress}%</div>
              <Progress value={courseProgress} className="mb-4 h-3" />
              <div className="text-sm text-gray-500 mb-6">Course completion</div>

              {/* Progress Icons */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center cursor-pointer" onClick={handleCVOptimizedClick}>
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-3 mx-auto hover:bg-green-200 transition-colors">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">CV Optimized</div>
                </div>
                <div className="text-center cursor-pointer" onClick={handleInterviewPrepClick}>
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 mx-auto hover:bg-blue-200 transition-colors">
                    <Clock className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-700 font-medium">Interview Prep</div>
                </div>
                <div className="text-center cursor-pointer" onClick={handleSalaryNegotiationClick}>
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 mx-auto hover:bg-gray-200 transition-colors">
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">Salary Negotiation</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold">
              <TrendingUp className="w-4 h-4 mr-2" />
              Active Progress Tracking
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Next Session */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-lg">Coming up</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Feature in development</div>
              <div className="text-sm font-semibold text-blue-600 mb-4">Stay tuned!</div>
              <div className="flex justify-end">
                <Button size="sm" className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl" disabled>
                  <Play className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <div className="text-center py-6 bg-white rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/tracker')}>
            <div className="text-4xl font-bold text-blue-600 mb-2">{applicationsThisMonth}</div>
            <div className="text-sm text-gray-600 mb-4">Applications this month</div>
            <div className="flex justify-center gap-1">
              {[...Array(Math.min(applicationsThisMonth, 12))].map((_, i) => (
                <div key={i} className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
