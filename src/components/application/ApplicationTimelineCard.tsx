
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationTimelineCardProps {
  application: JobApplication;
}

const ApplicationTimelineCard = ({ application }: ApplicationTimelineCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
            <div>
              <p className="text-sm font-medium">Application Submitted</p>
              <p className="text-xs text-gray-500">
                {format(new Date(application.date_applied), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-xs text-gray-500">
                {format(new Date(application.updated_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTimelineCard;
