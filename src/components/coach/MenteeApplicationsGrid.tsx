
import React, { useState, useMemo } from 'react';
import { JobApplication } from '@/types/jobApplications';
import MenteeSearchBar from './grid/MenteeSearchBar';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMentees = useMemo(() => {
    if (!searchTerm) return groupedApplications;

    const filtered: GroupedApplications = {};
    Object.entries(groupedApplications).forEach(([menteeId, data]) => {
      const fullName = `${data.menteeInfo.first_name} ${data.menteeInfo.last_name}`.toLowerCase();
      if (fullName.includes(searchTerm.toLowerCase())) {
        filtered[menteeId] = data;
      }
    });

    return filtered;
  }, [groupedApplications, searchTerm]);

  if (Object.keys(groupedApplications).length === 0) {
    return <EmptyState type="no-applications" />;
  }

  return (
    <div className="space-y-6">
      <MenteeSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultCount={Object.keys(filteredMentees).length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(filteredMentees).map(([menteeId, data]) => (
          <MenteeCard
            key={menteeId}
            menteeInfo={data.menteeInfo}
            applications={data.applications}
            onViewDetails={onViewDetails}
            onDeleteApplication={onDeleteApplication}
          />
        ))}
      </div>

      {Object.keys(filteredMentees).length === 0 && searchTerm && (
        <EmptyState type="no-search-results" searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default MenteeApplicationsGrid;
