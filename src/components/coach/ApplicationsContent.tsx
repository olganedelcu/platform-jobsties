
import React, { useState } from 'react';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import MenteeApplicationsList from '@/components/coach/MenteeApplicationsList';
import ApplicationDetailView from '@/components/coach/ApplicationDetailView';
import { JobApplication } from '@/types/jobApplications';

const ApplicationsContent = () => {
  const { applications, loading } = useCoachApplications();
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
  };

  const handleBackToList = () => {
    setSelectedApplication(null);
  };

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
      {selectedApplication ? (
        <ApplicationDetailView 
          application={selectedApplication} 
          onBack={handleBackToList}
        />
      ) : (
        <>
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

          <MenteeApplicationsList 
            applications={applications} 
            onViewDetails={handleViewDetails}
          />
        </>
      )}
    </div>
  );
};

export default ApplicationsContent;
