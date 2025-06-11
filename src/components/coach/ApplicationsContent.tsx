
import React, { useState } from 'react';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useMentees } from '@/hooks/useMentees';
import { useCoachApplicationActions } from '@/hooks/useCoachApplicationActions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List } from 'lucide-react';
import MenteeApplicationsGrid from './MenteeApplicationsGrid';
import MenteeApplicationsList from './MenteeApplicationsList';
import MenteeApplicationsSearch from './MenteeApplicationsSearch';
import ExcelLikeJobApplicationsTable from '@/components/ExcelLikeJobApplicationsTable';
import ApplicationsJobRecommendations from './ApplicationsJobRecommendations';

const ApplicationsContent = () => {
  const { applications, loading: applicationsLoading, refetchApplications } = useCoachApplications();
  const { mentees, loading: menteesLoading } = useMentees();
  const [activeTab, setActiveTab] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');

  const { handleUpdateApplication, handleDeleteApplication } = useCoachApplicationActions(
    applications,
    refetchApplications
  );

  console.log('ApplicationsContent: Loading state - applications:', applicationsLoading, 'mentees:', menteesLoading);
  console.log('ApplicationsContent: Applications data:', applications);
  console.log('ApplicationsContent: Mentees data:', mentees);

  if (applicationsLoading || menteesLoading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="text-center">
          <div className="text-lg">Loading applications...</div>
          <div className="text-sm text-gray-500 mt-2">
            Applications loading: {applicationsLoading ? 'Yes' : 'No'} | 
            Mentees loading: {menteesLoading ? 'Yes' : 'No'}
          </div>
        </div>
      </main>
    );
  }

  // Group applications by mentee
  const applicationsByMentee = applications.reduce((acc, app) => {
    if (!acc[app.mentee_id]) {
      acc[app.mentee_id] = [];
    }
    acc[app.mentee_id].push(app);
    return acc;
  }, {} as Record<string, typeof applications>);

  // Filter mentees based on search term
  const filteredMentees = mentees.filter(mentee => {
    if (!searchTerm) return true;
    const fullName = `${mentee.first_name} ${mentee.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Only show mentees that have applications and match the search
  const menteesWithApplications = filteredMentees.filter(
    mentee => applicationsByMentee[mentee.id] && applicationsByMentee[mentee.id].length > 0
  );

  // Get applications for filtered mentees
  const filteredApplications = applications.filter(app => 
    menteesWithApplications.some(mentee => mentee.id === app.mentee_id)
  );

  const totalMenteesWithApplications = mentees.filter(
    mentee => applicationsByMentee[mentee.id] && applicationsByMentee[mentee.id].length > 0
  ).length;

  console.log('ApplicationsContent: Filtered applications count:', filteredApplications.length);
  console.log('ApplicationsContent: Total mentees with applications:', totalMenteesWithApplications);

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mentee Applications</h1>
        <p className="text-gray-600 mt-2">Track and manage your mentees' job applications</p>
        <div className="text-sm text-gray-500 mt-1">
          Total applications: {applications.length} | Filtered: {filteredApplications.length}
        </div>
      </div>

      {/* Job Recommendations Section */}
      <ApplicationsJobRecommendations />

      <MenteeApplicationsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalMentees={totalMenteesWithApplications}
        filteredMentees={menteesWithApplications.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-80 grid-cols-3">
            <TabsTrigger value="table" className="flex items-center space-x-2">
              <span>Table View</span>
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center space-x-2">
              <Grid className="h-4 w-4" />
              <span>Grid View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>List View</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table" className="space-y-6">
          <ExcelLikeJobApplicationsTable
            applications={filteredApplications}
            onAddApplication={async () => {
              // Coaches can't add applications, only view/edit
            }}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
            isCoachView={true}
          />
        </TabsContent>

        <TabsContent value="grid" className="space-y-6">
          <MenteeApplicationsGrid
            applications={filteredApplications}
            onDeleteApplication={handleDeleteApplication}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <MenteeApplicationsList
            applications={filteredApplications}
            onDeleteApplication={handleDeleteApplication}
          />
        </TabsContent>
      </Tabs>

      {applications.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No applications found</div>
          <div className="text-sm text-gray-400">Your mentees haven't submitted any applications yet</div>
        </div>
      )}

      {menteesWithApplications.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No mentees found matching "{searchTerm}"</div>
          <Button variant="outline" onClick={() => setSearchTerm('')}>
            Clear search
          </Button>
        </div>
      )}

      {applications.length > 0 && filteredApplications.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Applications found but none are visible</div>
          <div className="text-sm text-gray-400">This might be a filtering issue. Total applications: {applications.length}</div>
        </div>
      )}
    </main>
  );
};

export default ApplicationsContent;
