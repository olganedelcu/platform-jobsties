
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, MessageSquare } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';
import { useJobApplicationsData } from '@/hooks/useJobApplicationsData';
import { User } from '@supabase/supabase-js';

interface MenteeRecentActivityCardProps {
  onViewAll: () => void;
  onAddApplication: () => void;
  user: User | null;
}

const MenteeRecentActivityCard = ({ onViewAll, onAddApplication, user }: MenteeRecentActivityCardProps) => {
  const { applications, loading } = useJobApplicationsData(user);

  // Get recent applications (last 7 days)
  const recentApplications = applications.filter(app => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(app.date_applied) >= oneWeekAgo;
  }).slice(0, 3); // Show only top 3

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-50 text-blue-700';
      case 'interviewing': return 'bg-purple-50 text-purple-700';
      case 'offer': return 'bg-green-50 text-green-700';
      case 'rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
          </Button>
        </div>
        
        {recentApplications.length > 0 ? (
          <div className="space-y-3">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{application.job_title}</div>
                  <div className="text-sm text-gray-600 truncate">{application.company_name}</div>
                  <div className="text-xs text-gray-500">
                    Applied {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                  </div>
                  {application.coach_notes && (
                    <div className="mt-1 flex items-start gap-1">
                      <MessageSquare className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border-l-2 border-blue-200">
                        <span className="font-medium">Coach: </span>
                        {application.coach_notes.length > 50 
                          ? `${application.coach_notes.substring(0, 50)}...` 
                          : application.coach_notes
                        }
                      </div>
                    </div>
                  )}
                </div>
                <Badge 
                  className={`text-xs px-2 py-1 ${getStatusColor(application.application_status)}`}
                >
                  {application.application_status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            ))}
            
            <div className="pt-2 border-t border-gray-200">
              <Button 
                onClick={onViewAll}
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                All Applications
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-600 mb-2 text-sm">No recent activity</div>
            <div className="text-xs text-gray-500 mb-3">Start applying to jobs to see your activity here</div>
            <Button 
              onClick={onAddApplication} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Application
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteeRecentActivityCard;
