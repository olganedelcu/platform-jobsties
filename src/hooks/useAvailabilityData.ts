
import { useState, useEffect } from 'react';
import { AvailabilitySlot, BookedTimeSlots } from '@/types/availability';
import { CalComAvailabilityService } from '@/services/calComAvailabilityService';
import { AvailabilityService } from '@/services/availabilityService';

export const useAvailabilityData = (coachId?: string | null) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<BookedTimeSlots>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAvailabilityData called with coachId:', coachId);
    
    // Since we're using Cal.com for availability, we use default availability structure
    // The actual time slots will be fetched from Cal.com when needed
    setAvailability(getCalComAvailabilityStructure());
    setBlockedDates([]);
    fetchBookedSessions();
  }, [coachId]);

  const fetchBookedSessions = async () => {
    try {
      const bookedSlots = await AvailabilityService.fetchBookedSessions();
      setBookedTimeSlots(bookedSlots);
    } catch (error) {
      console.error('Error fetching booked sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Returns a structure that represents Cal.com availability (Monday-Friday, 9-5)
  const getCalComAvailabilityStructure = (): AvailabilitySlot[] => {
    return [
      { id: '0', day_of_week: 0, start_time: '09:00', end_time: '17:00', is_available: false }, // Sunday
      { id: '1', day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true },  // Monday
      { id: '2', day_of_week: 2, start_time: '09:00', end_time: '17:00', is_available: true },  // Tuesday
      { id: '3', day_of_week: 3, start_time: '09:00', end_time: '17:00', is_available: true },  // Wednesday
      { id: '4', day_of_week: 4, start_time: '09:00', end_time: '17:00', is_available: true },  // Thursday
      { id: '5', day_of_week: 5, start_time: '09:00', end_time: '17:00', is_available: true },  // Friday
      { id: '6', day_of_week: 6, start_time: '09:00', end_time: '17:00', is_available: false }, // Saturday
    ];
  };

  return {
    availability,
    blockedDates,
    bookedTimeSlots,
    loading
  };
};
