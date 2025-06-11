
import React, { useMemo } from 'react';
import { JobApplication } from '@/types/jobApplications';
import MenteeCard from './grid/MenteeCard';
import EmptyState from './grid/EmptyState';

interface MenteeApplicationsGridProps {
  applications: JobApplication[];
  onViewDetails?: (application: JobApplication) => void;
  onDeleteApplication?: (applicationId: string) => void;
}

interface GroupedApplications {
  [menteeId: string]: {
    menteeInfo: {
      id: string;
      first_name: string;
      last_name: string;
    };
    applications: JobApplication[];
  };
}

const MenteeApplicationsGrid = ({ applications, onViewDetails, onDeleteApplication }: MenteeApplicationsGridProps) => {
  const groupedApplications = useMemo(() => {
    const grouped: GroupedApplications = {};
    
    applications.forEach((application) => {
      const menteeId = application.mentee_id;
      if (!grouped[menteeId]) {
        grouped[menteeId] = {
          menteeInfo: {
            id: menteeId,
            first_name: application.profiles?.first_name || 'Unknown',
            last_name: application.profiles?.last_name || 'User'
          },
          applications: []
        };
      }
      grouped[menteeId].applications.push(application);
    });

    return grouped;
  }, [applications]);

  if (Object.keys(groupedApplications).length === 0) {
    return <EmptyState type="no-applications" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Object.entries(groupedApplications).map(([menteeId, data]) => (
        <MenteeCard
          key={menteeId}
          menteeInfo={data.menteeInfo}
          applications={data.applications}
          onViewDetails={onViewDetails}
          onDeleteApplication={onDeleteApplication}
        />
      ))}
    </div>
  );
};

export default MenteeApplicationsGrid;
