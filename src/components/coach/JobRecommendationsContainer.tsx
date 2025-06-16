
import React from 'react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useMenteeNames } from '@/hooks/useMenteeNames';
import { useJobRecommendationActions } from '@/hooks/useJobRecommendationActions';
import JobRecommendationsHeader from './JobRecommendationsHeader';
import ApplicationsJobRecommendations from './ApplicationsJobRecommendations';
import JobRecommendationsList from './JobRecommendationsList';
import JobRecommendationAssignmentDialog from './JobRecommendationAssignmentDialog';

interface JobRecommendationsContainerProps {
  user: any;
}

const JobRecommendationsContainer = ({ user }: JobRecommendationsContainerProps) => {
  const { recommendations, loading: recommendationsLoading, deleteRecommendation, addRecommendation } = useJobRecommendations({
    userId: user?.id || '',
    isCoach: true
  });

  const {
    selectedRecommendation,
    assignmentDialogOpen,
    selectedAssignments,
    handleAssignToMoreMentees,
    handleAssignmentSubmit,
    handleSelectAssignment,
    handleSelectAll,
    handleDeleteSelected,
    closeAssignmentDialog
  } = useJobRecommendationActions({
    userId: user?.id || '',
    addRecommendation,
    deleteRecommendation
  });

  // Get unique mentee IDs for fetching names
  const uniqueMenteeIds = [...new Set(recommendations.map(rec => rec.mentee_id))];
  const { menteeNames, loading: menteeNamesLoading } = useMenteeNames(uniqueMenteeIds);

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
    <>
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
        onSelectAll={(checked) => handleSelectAll(checked, recommendations)}
        onSelectAssignment={handleSelectAssignment}
        onDeleteSelected={handleDeleteSelected}
        onAssignToMoreMentees={handleAssignToMoreMentees}
        onDeleteRecommendation={deleteRecommendation}
      />

      <JobRecommendationAssignmentDialog
        open={assignmentDialogOpen}
        onClose={closeAssignmentDialog}
        onAssign={handleAssignmentSubmit}
        recommendationTitle={selectedRecommendation?.job_title}
        companyName={selectedRecommendation?.company_name}
      />
    </>
  );
};

export default JobRecommendationsContainer;
