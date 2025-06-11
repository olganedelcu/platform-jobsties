
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format } from 'date-fns';
import RecommendationCard from './RecommendationCard';
import EmptyState from './EmptyState';

interface CurrentWeekSectionProps {
  currentWeekRecommendations: JobRecommendation[];
  currentWeekStart: string;
  userTimeZone: string;
  addingToTracker: string | null;
  onViewJob: (jobLink: string) => void;
  onMarkAsApplied: (recommendation: JobRecommendation) => void;
}

const CurrentWeekSection = ({
  currentWeekRecommendations,
  currentWeekStart,
  userTimeZone,
  addingToTracker,
  onViewJob,
  onMarkAsApplied
}: CurrentWeekSectionProps) => {
  // Extract just the city from timezone (e.g., "London" from "Europe/London")
  const getTimeZoneCity = (timezone: string) => {
    const parts = timezone.split('/');
    return parts[1] || timezone;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-medium">This Week ({getTimeZoneCity(userTimeZone)})</h3>
        <Badge variant="secondary">{currentWeekRecommendations.length}</Badge>
        {currentWeekStart && (
          <span className="text-sm text-gray-500">
            (Added this week starting {format(new Date(currentWeekStart), 'MMM dd, yyyy')})
          </span>
        )}
      </div>
      
      {currentWeekRecommendations.length > 0 ? (
        <div className="space-y-3">
          {currentWeekRecommendations.map((recommendation) => (
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
      ) : (
        <EmptyState type="current-week" />
      )}
    </div>
  );
};

export default CurrentWeekSection;
