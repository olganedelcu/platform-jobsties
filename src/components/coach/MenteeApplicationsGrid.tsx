
import React from 'react';
import { JobApplication } from '@/types/jobApplications';
import { useMentees } from '@/hooks/useMentees';
import MenteeCard from './grid/MenteeCard';

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
  const { mentees } = useMentees();

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No applications found for this mentee.</p>
      </div>
    );
  }

  // Group applications by mentee
  const applicationsByMentee = applications.reduce((acc, app) => {
    if (!acc[app.mentee_id]) {
      acc[app.mentee_id] = [];
    }
    acc[app.mentee_id].push(app);
    return acc;
  }, {} as Record<string, JobApplication[]>);

  // Get mentee info for each group
  const menteeGroups = Object.entries(applicationsByMentee).map(([menteeId, menteeApplications]) => {
    const menteeInfo = mentees.find(m => m.id === menteeId);
    return {
      menteeId,
      menteeInfo: menteeInfo || {
        id: menteeId,
        first_name: 'Unknown',
        last_name: 'Mentee'
      },
      applications: menteeApplications
    };
  });

  // Sort by number of applications (descending) and then by mentee name
  menteeGroups.sort((a, b) => {
    if (a.applications.length !== b.applications.length) {
      return b.applications.length - a.applications.length;
    }
    const nameA = `${a.menteeInfo.first_name} ${a.menteeInfo.last_name}`;
    const nameB = `${b.menteeInfo.first_name} ${b.menteeInfo.last_name}`;
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menteeGroups.map(({ menteeId, menteeInfo, applications }) => (
        <MenteeCard
          key={menteeId}
          menteeInfo={menteeInfo}
          applications={applications}
          onViewDetails={onViewDetails}
          onDeleteApplication={onDeleteApplication}
        />
      ))}
    </div>
  );
};

export default MenteeApplicationsGrid;
