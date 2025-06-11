
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationStatusSummaryProps {
  applications: JobApplication[];
}

const ApplicationStatusSummary = ({ applications }: ApplicationStatusSummaryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'interviewing': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSummary = (applications: JobApplication[]) => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.application_status] = (acc[app.application_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return statusCounts;
  };

  const statusSummary = getStatusSummary(applications);

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {Object.entries(statusSummary).map(([status, count]) => (
        <Badge key={status} className={`text-xs ${getStatusColor(status)}`}>
          {status.replace('_', ' ')}: {count}
        </Badge>
      ))}
    </div>
  );
};

export default ApplicationStatusSummary;
