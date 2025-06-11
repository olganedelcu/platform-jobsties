
import React from 'react';
import { useMentees } from '@/hooks/useMentees';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useCVFiles } from '@/hooks/useCVFiles';
import { useMenteeNotes } from '@/hooks/useMenteeNotes';
import { Card, CardContent } from '@/components/ui/card';
import MenteesHeader from '@/components/MenteesHeader';
import MenteesSearchBar from '@/components/MenteesSearchBar';
import MenteesTable from '@/components/MenteesTable';
import MenteesEmptyState from '@/components/MenteesEmptyState';

const MenteesContent = () => {
  const { mentees, loading } = useMentees();
  const { applications } = useCoachApplications();
  const { cvFiles } = useCVFiles();
  const { updateNote, getNoteForMentee, loading: notesLoading } = useMenteeNotes();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter mentees based on search term
  const filteredMentees = mentees.filter(mentee =>
    `${mentee.first_name} ${mentee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || notesLoading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Mentees</h1>
            <p className="text-gray-500 mt-2">Manage and track your assigned mentees</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-gray-500">Loading mentees...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <MenteesHeader menteeCount={mentees.length} />

      {mentees.length === 0 ? (
        <MenteesEmptyState type="no-mentees" />
      ) : (
        <div className="space-y-6">
          <MenteesSearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          <MenteesTable
            mentees={filteredMentees}
            applications={applications}
            cvFiles={cvFiles}
            updateNote={updateNote}
            getNoteForMentee={getNoteForMentee}
          />
        </div>
      )}
    </main>
  );
};

export default MenteesContent;
