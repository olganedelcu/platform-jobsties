
import { UseCoachAvailabilityReturn } from '@/types/availability';
import { useAvailabilityData } from '@/hooks/useAvailabilityData';
import { AvailabilityUtils } from '@/utils/availabilityUtils';

export const useCoachAvailability = (coachId?: string | null): UseCoachAvailabilityReturn => {
  const { availability, blockedDates, bookedTimeSlots, loading } = useAvailabilityData(coachId);

  const isDateAvailable = async (date: string): Promise<boolean> => {
    return AvailabilityUtils.checkDateAvailability(date, blockedDates, availability, coachId || undefined);
  };

  const getAvailableTimesForDate = async (date: string): Promise<string[]> => {
    const available = await isDateAvailable(date);
    return AvailabilityUtils.getAvailableTimesForDate(
      date,
      availability,
      bookedTimeSlots,
      available,
      coachId || undefined
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
