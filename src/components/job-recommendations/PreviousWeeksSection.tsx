
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { JobRecommendation } from '@/types/jobRecommendations';
import RecommendationCard from './RecommendationCard';

interface PreviousWeeksSectionProps {
  previousWeeksRecommendations: JobRecommendation[];
  userTimeZone: string;
  addingToTracker: string | null;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
}

const PreviousWeeksSection = ({
  previousWeeksRecommendations,
  userTimeZone,
  addingToTracker,
  onViewJob,
  onMarkAsApplied
}: PreviousWeeksSectionProps) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <h3 className="text-lg font-medium">Previous Weeks</h3>
      <Badge variant="outline">{previousWeeksRecommendations.length}</Badge>
    </div>
    
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {previousWeeksRecommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          userTimeZone={userTimeZone}
          addingToTracker={addingToTracker}
          onViewJob={onViewJob}
          onMarkAsApplied={onMarkAsApplied}
        />
      ))}
    </div>
  </div>
);

export default PreviousWeeksSection;
