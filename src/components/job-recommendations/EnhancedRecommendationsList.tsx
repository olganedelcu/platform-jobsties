
import React from 'react';
import { JobRecommendation } from '@/types/jobRecommendations';
import EnhancedRecommendationCard from './EnhancedRecommendationCard';
import EmptyState from './EmptyState';

interface EnhancedRecommendationsListProps {
  recommendations: JobRecommendation[];
  loading: boolean;
  actionLoading: boolean;
  emptyType: string;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
  onArchive: (recommendationId: string) => void;
  onReactivate: (recommendationId: string) => void;
}

const EnhancedRecommendationsList = ({
  recommendations,
  loading,
  actionLoading,
  emptyType,
  onViewJob,
  onMarkAsApplied,
  onArchive,
  onReactivate
}: EnhancedRecommendationsListProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading recommendations...</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <EmptyState type={emptyType} />;
  }

  return (
    <div className="space-y-3">
      {recommendations.map((recommendation) => (
        <EnhancedRecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          onViewJob={onViewJob}
          onMarkAsApplied={onMarkAsApplied}
          onArchive={onArchive}
          onReactivate={onReactivate}
          loading={actionLoading}
        />
      ))}
    </div>
  );
};

export default EnhancedRecommendationsList;
