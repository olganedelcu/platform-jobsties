
import React from 'react';
import { JobApplication } from '@/types/jobApplications';
import ApplicationItem from './grid/ApplicationItem';

interface MenteeApplicationsGridProps {
  applications: JobApplication[];
  onViewDetails?: (application: JobApplication) => void;
  onDeleteApplication?: (applicationId: string) => void;
}

const MenteeApplicationsGrid = ({ 
  applications, 
  onViewDetails, 
  onDeleteApplication 
}: MenteeApplicationsGridProps) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No applications found for this mentee.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => (
        <div key={application.id} className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{application.job_title}</h4>
              <p className="text-sm text-gray-600">{application.company_name}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Applied</span>
              <p className="text-sm font-medium">{new Date(application.date_applied).toLocaleDateString()}</p>
            </div>
          </div>
          
          <ApplicationItem
            application={application}
            onViewDetails={onViewDetails}
            onDeleteApplication={onDeleteApplication}
          />
        </div>
      ))}
    </div>
  );
};

export default MenteeApplicationsGrid;
