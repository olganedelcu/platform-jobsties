
import { useState, useEffect } from 'react';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { JobRecommendation } from '@/types/jobRecommendations';
import { format, startOfWeek, isWithinInterval, addDays } from 'date-fns';

interface TimeZoneAwareRecommendations {
  currentWeekRecommendations: JobRecommendation[];
  previousWeeksRecommendations: JobRecommendation[];
  userTimeZone: string;
  currentWeekStart: string;
}

export const useTimeZoneAwareRecommendations = (userId: string): TimeZoneAwareRecommendations => {
  const { recommendations, loading } = useJobRecommendations({ userId, isCoach: false });
  const [userTimeZone, setUserTimeZone] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState('');

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimeZone(timeZone);
    
    // Calculate current week start in user's timezone
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
    setCurrentWeekStart(format(weekStart, 'yyyy-MM-dd'));
    
    console.log('User timezone:', timeZone);
    console.log('Current week start:', format(weekStart, 'yyyy-MM-dd'));
  }, []);

  // Separate current week from previous weeks based on when the recommendation was created
  const getCurrentWeekRecommendations = () => {
    if (!currentWeekStart) return [];
    
    const weekStart = new Date(currentWeekStart);
    const weekEnd = addDays(weekStart, 7);
    
    return recommendations.filter(rec => {
      const createdDate = new Date(rec.created_at);
      console.log('Checking recommendation created at:', rec.created_at, 'against current week:', currentWeekStart);
      
      return isWithinInterval(createdDate, {
        start: weekStart,
        end: weekEnd
      });
    });
  };

  const getPreviousWeeksRecommendations = () => {
    if (!currentWeekStart) return [];
    
    const weekStart = new Date(currentWeekStart);
    
    return recommendations.filter(rec => {
      const createdDate = new Date(rec.created_at);
      return createdDate < weekStart;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  return {
    currentWeekRecommendations: getCurrentWeekRecommendations(),
    previousWeeksRecommendations: getPreviousWeeksRecommendations(),
    userTimeZone,
    currentWeekStart
  };
};
