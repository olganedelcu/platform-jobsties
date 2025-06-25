
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <Card className="border border-gray-200 shadow-sm h-80">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-700 text-xs h-6 px-2"
          >
            View All
          </Button>
        </div>
        
        {recentApplications.length > 0 ? (
          <>
            <ScrollArea className="h-56">
              <div className="space-y-1.5 pr-2">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-md">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{application.job_title}</div>
                      <div className="text-xs text-gray-600 truncate">{application.company_name}</div>
                      <div className="text-xs text-gray-500">
                        Applied {format(new Date(application.date_applied), 'MMM dd, yyyy')}
                      </div>
                      {application.coach_notes && (
                        <div className="mt-1 flex items-start gap-1">
                          <MessageSquare className="h-2 w-2 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-blue-700 bg-blue-50 px-1 py-0.5 rounded border-l border-blue-200 line-clamp-2">
                            <span className="font-medium">Coach: </span>
                            {application.coach_notes.length > 50 
                              ? `${application.coach_notes.substring(0, 50)}...` 
                              : application.coach_notes
                            }
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1 py-0 h-5 ${
                          application.application_status === 'applied' ? 'bg-blue-50 text-blue-700' :
                          application.application_status === 'interviewed' ? 'bg-purple-50 text-purple-700' :
                          application.application_status === 'offered' ? 'bg-green-50 text-green-700' :
                          'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {application.application_status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="pt-2 border-t border-gray-200">
              <Button 
                onClick={onViewAll}
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm h-7"
              >
                All Applications
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-gray-600 mb-1 text-sm">No recent activity</div>
            <div className="text-xs text-gray-500 mb-2">Start applying to jobs to see your activity here</div>
            <Button 
              onClick={onAddApplication} 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-7"
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
