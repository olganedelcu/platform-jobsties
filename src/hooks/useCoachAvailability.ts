
import { UseCoachAvailabilityReturn } from '@/types/availability';
import { useAvailabilityData } from '@/hooks/useAvailabilityData';
import { AvailabilityUtils } from '@/utils/availabilityUtils';

export const useCoachAvailability = (coachId?: string | null): UseCoachAvailabilityReturn => {
  const { availability, blockedDates, bookedTimeSlots, loading } = useAvailabilityData(coachId);

  const isDateAvailable = async (date: string): Promise<boolean> => {
    if (!coachId) return false;
    return AvailabilityUtils.checkDateAvailability(date, blockedDates, availability, coachId);
  };

  const getAvailableTimesForDate = async (date: string): Promise<string[]> => {
    if (!coachId) return [];
    const available = await isDateAvailable(date);
    return AvailabilityUtils.getAvailableTimesForDate(
      date,
      availability,
      bookedTimeSlots,
      available,
      coachId
    );
  };

  return {
    availability,
    blockedDates,
    loading,
    isDateAvailable,
    getAvailableTimesForDate
  };
};
