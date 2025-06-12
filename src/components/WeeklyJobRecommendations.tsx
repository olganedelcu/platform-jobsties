
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Clock } from 'lucide-react';
import { useJobRecommendationActions } from '@/hooks/useJobRecommendationActions';
import { useTimeZoneAwareRecommendations } from '@/hooks/useTimeZoneAwareRecommendations';
import { useJobViewHandler } from '@/hooks/useJobViewHandler';
import { JobRecommendation } from '@/types/jobRecommendations';
import CurrentWeekSection from './job-recommendations/CurrentWeekSection';
import PreviousWeeksSection from './job-recommendations/PreviousWeeksSection';
import EmptyState from './job-recommendations/EmptyState';

interface WeeklyJobRecommendationsProps {
  userId: string;
}

const WeeklyJobRecommendations = ({ userId }: WeeklyJobRecommendationsProps) => {
  const {
    currentWeekRecommendations,
    previousWeeksRecommendations,
    userTimeZone,
    currentWeekStart
  } = useTimeZoneAwareRecommendations(userId);
  
  const [addingToTracker, setAddingToTracker] = useState<string | null>(null);

  const { markAsApplied } = useJobRecommendationActions({ 
    user: { id: userId }
  });

  const { handleViewJob } = useJobViewHandler();

  const handleMarkAsApplied = async (recommendation: JobRecommendation) => {
    console.log('Marking as applied:', recommendation);
    
    if (addingToTracker === recommendation.id) {
      console.log('Already adding this recommendation, skipping');
      return;
    }

    setAddingToTracker(recommendation.id);
    
    try {
      await markAsApplied(recommendation);
      console.log('Successfully marked as applied');
    } catch (error) {
      console.error('Error marking as applied:', error);
    } finally {
      setAddingToTracker(null);
    }
  };

  const totalRecommendations = currentWeekRecommendations.length + previousWeeksRecommendations.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Weekly Job Recommendations
        </CardTitle>
        {userTimeZone && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Your timezone: {userTimeZone}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6 max-h-[500px] overflow-y-auto">
        {/* Current Week Recommendations */}
        <CurrentWeekSection
          currentWeekRecommendations={currentWeekRecommendations}
          currentWeekStart={currentWeekStart}
          userTimeZone={userTimeZone}
          addingToTracker={addingToTracker}
          onViewJob={handleViewJob}
          onMarkAsApplied={handleMarkAsApplied}
        />

        {/* Previous Weeks */}
        {previousWeeksRecommendations.length > 0 && (
          <PreviousWeeksSection
            previousWeeksRecommendations={previousWeeksRecommendations}
            userTimeZone={userTimeZone}
            addingToTracker={addingToTracker}
            onViewJob={handleViewJob}
            onMarkAsApplied={handleMarkAsApplied}
          />
        )}

        {totalRecommendations === 0 && (
          <EmptyState type="no-recommendations" />
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyJobRecommendations;
