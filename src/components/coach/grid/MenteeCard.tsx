
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { JobApplication } from '@/types/jobApplications';
import ApplicationStatusSummary from './ApplicationStatusSummary';
import ApplicationItem from './ApplicationItem';

interface MenteeCardProps {
  menteeInfo: {
    id: string;
    first_name: string;
    last_name: string;
  };
  applications: JobApplication[];
  onViewDetails?: (application: JobApplication) => void;
  onDeleteApplication?: (applicationId: string) => void;
}

const MenteeCard = ({ menteeInfo, applications, onViewDetails, onDeleteApplication }: MenteeCardProps) => {
  // Show all applications, sorted by most recent first
  const sortedApplications = applications
    .sort((a, b) => new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime());

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                {menteeInfo.first_name[0]}{menteeInfo.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {menteeInfo.first_name} {menteeInfo.last_name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {applications.length} application{applications.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <ApplicationStatusSummary applications={applications} />
      </CardHeader>

      <CardContent className="p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">All Applications</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedApplications.map((application) => (
            <ApplicationItem
              key={application.id}
              application={application}
              onViewDetails={onViewDetails}
              onDeleteApplication={onDeleteApplication}
            />
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No applications yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenteeCard;
