
import React, { useState } from 'react';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useCoachApplicationActions } from '@/hooks/useCoachApplicationActions';
import MenteeApplicationsList from '@/components/coach/MenteeApplicationsList';
import MenteeApplicationsGrid from '@/components/coach/MenteeApplicationsGrid';
import ApplicationDetailView from '@/components/coach/ApplicationDetailView';
import { Button } from '@/components/ui/button';
import { JobApplication } from '@/types/jobApplications';
import { Grid, List } from 'lucide-react';

const ApplicationsContent = () => {
  const { applications, loading, refetchApplications } = useCoachApplications();
  const { handleUpdateApplication } = useCoachApplicationActions(applications, refetchApplications);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
  };

  const handleBackToList = () => {
    setSelectedApplication(null);
  };

  const handleApplicationUpdate = async (applicationId: string, updates: Partial<JobApplication>) => {
    await handleUpdateApplication(applicationId, updates);
    // Update the selected application with the new data
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication(prev => prev ? { ...prev, ...updates } : null);
    }
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
          onUpdate={handleApplicationUpdate}
        />
      ) : (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
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
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center space-x-2"
                >
                  <Grid className="h-4 w-4" />
                  <span>Grid</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center space-x-2"
                >
                  <List className="h-4 w-4" />
                  <span>List</span>
                </Button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <MenteeApplicationsGrid 
              applications={applications} 
              onViewDetails={handleViewDetails}
            />
          ) : (
            <MenteeApplicationsList 
              applications={applications} 
              onViewDetails={handleViewDetails}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsContent;
