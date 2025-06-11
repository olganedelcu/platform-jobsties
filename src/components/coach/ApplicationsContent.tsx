
import React, { useState } from 'react';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useMentees } from '@/hooks/useMentees';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List } from 'lucide-react';
import MenteeApplicationsGrid from './MenteeApplicationsGrid';
import MenteeApplicationsList from './MenteeApplicationsList';
import MenteeApplicationsSearch from './MenteeApplicationsSearch';

const ApplicationsContent = () => {
  const { applications, loading: applicationsLoading } = useCoachApplications();
  const { mentees, loading: menteesLoading } = useMentees();
  const [activeTab, setActiveTab] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  if (applicationsLoading || menteesLoading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="text-center">Loading applications...</div>
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

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mentee Applications</h1>
        <p className="text-gray-600 mt-2">Track and manage your mentees' job applications</p>
      </div>

      <MenteeApplicationsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalMentees={totalMenteesWithApplications}
        filteredMentees={menteesWithApplications.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-64 grid-cols-2">
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

        <TabsContent value="grid" className="space-y-6">
          <MenteeApplicationsGrid
            applications={filteredApplications}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <MenteeApplicationsList
            mentees={menteesWithApplications}
            applicationsByMentee={applicationsByMentee}
          />
        </TabsContent>
      </Tabs>

      {menteesWithApplications.length === 0 && !searchTerm && (
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
    </main>
  );
};

export default ApplicationsContent;
