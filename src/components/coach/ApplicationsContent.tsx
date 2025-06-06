
import React from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import MenteeApplicationsList from '@/components/coach/MenteeApplicationsList';

const ApplicationsContent = () => {
  const { user } = useAuthState();
  const { 
    applications, 
    loading, 
    handleUpdateNotes 
  } = useCoachApplications(user?.id);

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
          View and provide feedback on your mentees' job applications
        </p>
      </div>

      <MenteeApplicationsList 
        applications={applications} 
        onUpdateNotes={handleUpdateNotes} 
      />
    </div>
  );
};

export default ApplicationsContent;
