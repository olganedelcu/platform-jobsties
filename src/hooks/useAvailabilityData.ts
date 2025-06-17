
import { useState, useEffect } from 'react';
import { AvailabilitySlot, BookedTimeSlots } from '@/types/availability';
import { AvailabilityService } from '@/services/availabilityService';

export const useAvailabilityData = (coachId?: string | null) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<BookedTimeSlots>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coachId) {
      fetchData();
    } else {
      // Use default availability when no coach ID is available
      setAvailability(AvailabilityService.getDefaultAvailability());
      setBlockedDates([]);
      fetchBookedSessions();
    }
  }, [coachId]);

  const fetchData = async () => {
    if (!coachId) return;

    try {
      const [availabilityData, blockedDatesData] = await Promise.all([
        AvailabilityService.fetchAvailability(coachId),
        AvailabilityService.fetchBlockedDates(coachId)
      ]);

      setAvailability(availabilityData);
      setBlockedDates(blockedDatesData);
    } catch (error) {
      console.error('Error fetching availability data:', error);
      setAvailability(AvailabilityService.getDefaultAvailability());
      setBlockedDates([]);
    }

    await fetchBookedSessions();
  };

  const fetchBookedSessions = async () => {
    try {
      const bookedSlots = await AvailabilityService.fetchBookedSessions();
      setBookedTimeSlots(bookedSlots);
    } finally {
      setLoading(false);
    }
  };

  return {
    availability,
    blockedDates,
    bookedTimeSlots,
    loading
  };
};
