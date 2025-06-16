
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, MessageSquare } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface RecentActivityCardProps {
  recentApplications: JobApplication[];
  onViewAll: () => void;
  onAddApplication: () => void;
}

const RecentActivityCard = ({ recentApplications, onViewAll, onAddApplication }: RecentActivityCardProps) => {
  return (
    <Card className="border border-indigo-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-indigo-900">Recent Activity</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAll}
            className="text-indigo-600 hover:text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          >
            View All
          </Button>
        </div>
        
        {recentApplications.length > 0 ? (
          <div className="space-y-3">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-indigo-900">{application.job_title}</div>
                  <div className="text-sm text-indigo-700">{application.company_name}</div>
                  <div className="text-xs text-indigo-500">
                    Applied {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                  </div>
                  {application.coach_notes && (
                    <div className="mt-2 flex items-start gap-1">
                      <MessageSquare className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border-l-2 border-blue-200">
                        <span className="font-medium">Coach feedback: </span>
                        {application.coach_notes.length > 80 
                          ? `${application.coach_notes.substring(0, 80)}...` 
                          : application.coach_notes
                        }
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      application.application_status === 'applied' ? 'bg-blue-50 text-blue-700' :
                      application.application_status === 'interviewing' ? 'bg-purple-50 text-purple-700' :
                      application.application_status === 'offer' ? 'bg-green-50 text-green-700' :
                      'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {application.application_status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="text-indigo-700 mb-2">No recent activity</div>
            <div className="text-sm text-indigo-500 mb-4">Start applying to jobs to see your activity here</div>
            <Button 
              onClick={onAddApplication} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Application
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
