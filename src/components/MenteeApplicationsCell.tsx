
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { JobApplication } from '@/types/jobApplications';
import { getStatusCounts } from '@/utils/menteeTableUtils';

interface MenteeApplicationsCellProps {
  applications: JobApplication[];
}

const MenteeApplicationsCell = ({ applications }: MenteeApplicationsCellProps) => {
  const statusCounts = getStatusCounts(applications);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">
        {applications.length} total
      </div>
      <div className="flex flex-wrap gap-1">
        {statusCounts.applied > 0 && (
          <Badge variant="secondary" className="text-xs">
            {statusCounts.applied} Applied
          </Badge>
        )}
        {statusCounts.interview > 0 && (
          <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
            {statusCounts.interview} Interview
          </Badge>
        )}
        {statusCounts.offer > 0 && (
          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
            {statusCounts.offer} Offer
          </Badge>
        )}
        {statusCounts.rejected > 0 && (
          <Badge variant="destructive" className="text-xs">
            {statusCounts.rejected} Rejected
          </Badge>
        )}
      </div>
    </div>
  );
};

export default MenteeApplicationsCell;
