
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

  // Separate current week from previous weeks based on user's local time
  const getCurrentWeekRecommendations = () => {
    if (!currentWeekStart) return [];
    
    return recommendations.filter(rec => {
      const recWeekStart = rec.week_start_date;
      return recWeekStart === currentWeekStart;
    });
  };

  const getPreviousWeeksRecommendations = () => {
    if (!currentWeekStart) return [];
    
    return recommendations.filter(rec => {
      const recWeekStart = rec.week_start_date;
      return recWeekStart !== currentWeekStart;
    }).sort((a, b) => b.week_start_date.localeCompare(a.week_start_date));
  };

  return {
    currentWeekRecommendations: getCurrentWeekRecommendations(),
    previousWeeksRecommendations: getPreviousWeeksRecommendations(),
    userTimeZone,
    currentWeekStart
  };
};
