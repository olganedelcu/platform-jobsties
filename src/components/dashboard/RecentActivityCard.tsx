
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';
import { format } from 'date-fns';

interface RecentActivityCardProps {
  recentApplications: JobApplication[];
  onViewAll: () => void;
  onAddApplication: () => void;
}

const RecentActivityCard = ({ recentApplications, onViewAll, onAddApplication }: RecentActivityCardProps) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
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
              <div key={application.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{application.job_title}</div>
                  <div className="text-sm text-gray-600">{application.company_name}</div>
                  <div className="text-xs text-gray-500">
                    Applied {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                  </div>
                </div>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-600 mb-2">No recent activity</div>
            <div className="text-sm text-gray-500 mb-4">Start applying to jobs to see your activity here</div>
            <Button 
              onClick={onAddApplication} 
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

export default RecentActivityCard;
