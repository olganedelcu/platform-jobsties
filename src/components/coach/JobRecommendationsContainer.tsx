
import React, { useState, useMemo } from 'react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useMenteeNames } from '@/hooks/useMenteeNames';
import { useJobRecommendationActions } from '@/hooks/useJobRecommendationActions';
import ApplicationsJobRecommendations from './ApplicationsJobRecommendations';
import JobRecommendationsList from './JobRecommendationsList';
import JobRecommendationAssignmentDialog from './JobRecommendationAssignmentDialog';
import JobRecommendationsMenteeSearch from './JobRecommendationsMenteeSearch';

interface JobRecommendationsContainerProps {
  user: any;
}

const JobRecommendationsContainer = ({ user }: JobRecommendationsContainerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter recommendations based on search term
  const filteredRecommendations = useMemo(() => {
    if (!searchTerm.trim()) {
      return recommendations;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return recommendations.filter(rec => {
      const menteeName = menteeNames[rec.mentee_id]?.toLowerCase() || '';
      return menteeName.includes(lowerSearchTerm);
    });
  }, [recommendations, searchTerm, menteeNames]);

  // Group filtered recommendations by job details to show unique jobs
  const groupedRecommendations = filteredRecommendations.reduce((acc, rec) => {
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

  // Count unique mentees in filtered results
  const uniqueMenteeCount = [...new Set(filteredRecommendations.map(rec => rec.mentee_id))].length;

  return (
    <>
      {/* Job Recommendations Form Section */}
      <ApplicationsJobRecommendations />

      {/* Search functionality */}
      <JobRecommendationsMenteeSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultCount={uniqueMenteeCount}
      />

      {/* All Recommendations List */}
      <JobRecommendationsList
        uniqueRecommendations={uniqueRecommendations}
        recommendations={filteredRecommendations}
        menteeNames={menteeNames}
        selectedAssignments={selectedAssignments}
        recommendationsLoading={recommendationsLoading}
        menteeNamesLoading={menteeNamesLoading}
        onSelectAll={(checked) => handleSelectAll(checked, filteredRecommendations)}
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
