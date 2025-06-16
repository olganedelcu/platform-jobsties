
import React, { useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import ProtectedCoachRoute from '@/components/ProtectedCoachRoute';
import CoachNavigation from '@/components/CoachNavigation';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useMenteeNames } from '@/hooks/useMenteeNames';
import { useToast } from '@/hooks/use-toast';
import JobRecommendationAssignmentDialog from '@/components/coach/JobRecommendationAssignmentDialog';
import ApplicationsJobRecommendations from '@/components/coach/ApplicationsJobRecommendations';
import JobRecommendationsHeader from '@/components/coach/JobRecommendationsHeader';
import JobRecommendationsList from '@/components/coach/JobRecommendationsList';

const CoachJobRecommendations = () => {
  const { user, loading, handleSignOut } = useAuthState();
  const { toast } = useToast();
  const { recommendations, loading: recommendationsLoading, deleteRecommendation, addRecommendation } = useJobRecommendations({
    userId: user?.id || '',
    isCoach: true
  });
  
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);

  // Get unique mentee IDs for fetching names
  const uniqueMenteeIds = [...new Set(recommendations.map(rec => rec.mentee_id))];
  const { menteeNames, loading: menteeNamesLoading } = useMenteeNames(uniqueMenteeIds);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleAssignToMoreMentees = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setAssignmentDialogOpen(true);
  };

  const handleAssignmentSubmit = async (menteeIds: string[], weekStartDate: string) => {
    if (!selectedRecommendation) return;

    try {
      const promises = menteeIds.map(menteeId =>
        addRecommendation({
          menteeId,
          jobTitle: selectedRecommendation.job_title,
          jobLink: selectedRecommendation.job_link,
          companyName: selectedRecommendation.company_name,
          description: selectedRecommendation.description,
          weekStartDate
        })
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `Job recommendation assigned to ${menteeIds.length} additional mentee(s).`,
      });

      setAssignmentDialogOpen(false);
      setSelectedRecommendation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign job recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectAssignment = (assignmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignments(prev => [...prev, assignmentId]);
    } else {
      setSelectedAssignments(prev => prev.filter(id => id !== assignmentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allAssignmentIds = recommendations.map(rec => rec.id);
      setSelectedAssignments(allAssignmentIds);
    } else {
      setSelectedAssignments([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAssignments.length === 0) return;

    try {
      const promises = selectedAssignments.map(id => deleteRecommendation(id));
      await Promise.all(promises);

      toast({
        title: "Success",
        description: `${selectedAssignments.length} recommendation(s) deleted successfully.`,
      });

      setSelectedAssignments([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some recommendations. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Group recommendations by job details to show unique jobs
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    const key = `${rec.job_title}-${rec.company_name}-${rec.job_link}`;
    if (!acc[key]) {
      acc[key] = {
        ...rec,
        assignments: []
      };
    }
    acc[key].assignments.push({
      id: rec.id,
      mentee_id: rec.mentee_id,
      week_start_date: rec.week_start_date,
      created_at: rec.created_at
    });
    return acc;
  }, {} as Record<string, any>);

  const uniqueRecommendations = Object.values(groupedRecommendations);

  return (
    <ProtectedCoachRoute>
      <div className="min-h-screen bg-gray-50">
        <CoachNavigation user={user} onSignOut={handleSignOut} />
        
        <main className="max-w-7xl mx-auto py-8 px-6">
          <JobRecommendationsHeader />

          {/* Job Recommendations Form Section */}
          <ApplicationsJobRecommendations />

          {/* All Recommendations List */}
          <JobRecommendationsList
            uniqueRecommendations={uniqueRecommendations}
            recommendations={recommendations}
            menteeNames={menteeNames}
            selectedAssignments={selectedAssignments}
            recommendationsLoading={recommendationsLoading}
            menteeNamesLoading={menteeNamesLoading}
            onSelectAll={handleSelectAll}
            onSelectAssignment={handleSelectAssignment}
            onDeleteSelected={handleDeleteSelected}
            onAssignToMoreMentees={handleAssignToMoreMentees}
            onDeleteRecommendation={deleteRecommendation}
          />
        </main>

        <JobRecommendationAssignmentDialog
          open={assignmentDialogOpen}
          onClose={() => {
            setAssignmentDialogOpen(false);
            setSelectedRecommendation(null);
          }}
          onAssign={handleAssignmentSubmit}
          recommendationTitle={selectedRecommendation?.job_title}
          companyName={selectedRecommendation?.company_name}
        />
      </div>
    </ProtectedCoachRoute>
  );
};

export default CoachJobRecommendations;
