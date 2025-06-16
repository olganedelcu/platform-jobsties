
import React, { memo } from 'react';
import { JobRecommendation } from '@/types/jobRecommendations';
import RecommendationCardHeader from './RecommendationCardHeader';
import RecommendationCardDescription from './RecommendationCardDescription';
import RecommendationCardActions from './RecommendationCardActions';

interface EnhancedRecommendationCardProps {
  recommendation: JobRecommendation;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
  onArchive: (recommendationId: string) => void;
  onReactivate: (recommendationId: string) => void;
  loading: boolean;
}

const EnhancedRecommendationCard = memo(({
  recommendation,
  onViewJob,
  onMarkAsApplied,
  onArchive,
  onReactivate,
  loading
}: EnhancedRecommendationCardProps) => {
  return (
    <div className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <RecommendationCardHeader recommendation={recommendation} />
      </div>

      <RecommendationCardDescription description={recommendation.description} />

      <RecommendationCardActions
        recommendation={recommendation}
        loading={loading}
        onViewJob={onViewJob}
        onMarkAsApplied={onMarkAsApplied}
        onArchive={onArchive}
        onReactivate={onReactivate}
      />
    </div>
  );
});

EnhancedRecommendationCard.displayName = 'EnhancedRecommendationCard';

export default EnhancedRecommendationCard;
