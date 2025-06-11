
import React from 'react';
import { useMentees } from '@/hooks/useMentees';
import { useCoachApplications } from '@/hooks/useCoachApplications';
import { useCVFiles } from '@/hooks/useCVFiles';
import { useMenteeNotes } from '@/hooks/useMenteeNotes';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import MenteesHeader from '@/components/MenteesHeader';
import MenteesSearchBar from '@/components/MenteesSearchBar';
import MenteesTable from '@/components/MenteesTable';
import MenteesEmptyState from '@/components/MenteesEmptyState';
import { assignAllMenteesToCurrentCoach } from '@/utils/menteeAssignmentUtils';

const MenteesContent = () => {
  const { mentees, loading, fetchMentees } = useMentees();
  const { applications } = useCoachApplications();
  const { cvFiles } = useCVFiles();
  const { updateNote, getNoteForMentee, loading: notesLoading } = useMenteeNotes();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAssigning, setIsAssigning] = React.useState(false);

  // Filter mentees based on search term
  const filteredMentees = mentees.filter(mentee =>
    `${mentee.first_name} ${mentee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignMentees = async () => {
    setIsAssigning(true);
    const success = await assignAllMenteesToCurrentCoach(toast);
    if (success) {
      await fetchMentees(); // Refresh the mentees list
    }
    setIsAssigning(false);
  };

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
        <div className="space-y-4">
          <MenteesEmptyState type="no-mentees" />
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  If there are mentees in the profiles table that should be displayed, click the button below:
                </p>
                <Button 
                  onClick={handleAssignMentees}
                  disabled={isAssigning}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isAssigning ? 'animate-spin' : ''}`} />
                  <span>
                    {isAssigning ? 'Loading Mentees...' : 'Load All Mentees from Profiles'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
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
    </main>
  );
};

export default MenteesContent;
