
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import JobApplicationStatusBadge from '@/components/JobApplicationStatusBadge';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationDetailsCardProps {
  application: JobApplication;
  isEditing: boolean;
  editData: Partial<JobApplication>;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
}

const ApplicationDetailsCard = ({
  application,
  isEditing,
  editData,
  onEditDataChange
}: ApplicationDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Application Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600 min-w-[80px]">Date Applied:</span>
            {isEditing ? (
              <Input
                type="date"
                value={editData.date_applied || ''}
                onChange={(e) => onEditDataChange({ date_applied: e.target.value })}
                className="flex-1"
              />
            ) : (
              <span className="font-medium">
                {format(new Date(application.date_applied), 'MMMM dd, yyyy')}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 min-w-[80px]">Status:</span>
            {isEditing ? (
              <Select
                value={editData.application_status || ''}
                onValueChange={(value) => onEditDataChange({ application_status: value })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="to_be_considered">To Be Considered</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer">Offer Received</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <JobApplicationStatusBadge status={application.application_status} />
            )}
          </div>

          <div className="flex items-center space-x-3 md:col-span-2">
            <span className="text-sm text-gray-600 min-w-[80px]">Job Link:</span>
            {isEditing ? (
              <Input
                value={editData.job_link || ''}
                onChange={(e) => onEditDataChange({ job_link: e.target.value })}
                className="flex-1"
                placeholder="Job posting URL"
              />
            ) : (
              application.job_link ? (
                <a 
                  href={application.job_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Job Posting
                </a>
              ) : (
                <span className="text-gray-500">Not provided</span>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationDetailsCard;
