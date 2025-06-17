
import React from 'react';
import { useMentees } from '@/hooks/useMentees';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useCVFiles } from '@/hooks/useCVFiles';
import { useMenteeNotes } from '@/hooks/useMenteeNotes';
import MenteesHeader from '@/components/MenteesHeader';
import MenteesSearchBar from '@/components/MenteesSearchBar';
import MenteesTable from '@/components/MenteesTable';
import MenteesEmptyState from '@/components/MenteesEmptyState';
import MenteesDebugPanel from '@/components/mentees/MenteesDebugPanel';
import MenteesLoadingState from '@/components/mentees/MenteesLoadingState';
import FormspreeConfiguration from '@/components/FormspreeConfiguration';

const MenteesContent = () => {
  const { mentees, loading, fetchMentees } = useMentees();
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
    return <MenteesLoadingState />;
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <MenteesHeader menteeCount={mentees.length} />

      {mentees.length === 0 ? (
        <div className="space-y-4">
          <MenteesEmptyState type="no-mentees" />
          <MenteesDebugPanel onRefresh={fetchMentees} />
        </div>
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

      {/* Formspree Configuration Section */}
      <div className="border-t pt-8">
        <FormspreeConfiguration />
      </div>
    </main>
  );
};

export default MenteesContent;
