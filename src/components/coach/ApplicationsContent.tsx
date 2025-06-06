
import React from 'react';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import MenteeApplicationsList from '@/components/coach/MenteeApplicationsList';

const ApplicationsContent = () => {
  const { applications, loading } = useCoachApplications();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <p className="text-lg">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mentee Job Applications</h1>
        <p className="text-gray-600 mt-2">
          View your mentees' job applications and track their progress
        </p>
        {applications.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <MenteeApplicationsList applications={applications} />
    </div>
  );
};

export default ApplicationsContent;
