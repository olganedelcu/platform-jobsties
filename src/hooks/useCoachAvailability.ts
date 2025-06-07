
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface UseCoachAvailabilityReturn {
  availability: AvailabilitySlot[];
  blockedDates: string[];
  loading: boolean;
  isDateAvailable: (date: string) => boolean;
  getAvailableTimesForDate: (date: string) => string[];
}

export const useCoachAvailability = (coachId?: string): UseCoachAvailabilityReturn => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coachId) {
      fetchAvailability();
      fetchBlockedDates();
    } else {
      // If no coachId provided, set default availability for Ana
      setDefaultAvailability();
      setLoading(false);
    }
  }, [coachId]);

  const setDefaultAvailability = () => {
    // Default availability pattern: Monday to Friday, 9am to 5pm
    const defaultAvailability = [
      { id: '0', day_of_week: 0, start_time: '09:00', end_time: '17:00', is_available: false }, // Sunday
      { id: '1', day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true },  // Monday
      { id: '2', day_of_week: 2, start_time: '09:00', end_time: '17:00', is_available: true },  // Tuesday
      { id: '3', day_of_week: 3, start_time: '09:00', end_time: '17:00', is_available: true },  // Wednesday
      { id: '4', day_of_week: 4, start_time: '09:00', end_time: '17:00', is_available: true },  // Thursday
      { id: '5', day_of_week: 5, start_time: '09:00', end_time: '17:00', is_available: true },  // Friday
      { id: '6', day_of_week: 6, start_time: '09:00', end_time: '17:00', is_available: false }, // Saturday
    ];
    setAvailability(defaultAvailability);
  };

  const fetchAvailability = async () => {
    if (!coachId) return;

    try {
      const { data, error } = await (supabase as any)
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .order('day_of_week');

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Fallback to default availability if fetch fails
      setDefaultAvailability();
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedDates = async () => {
    if (!coachId) return;

    try {
      const { data, error } = await (supabase as any)
        .from('coach_blocked_dates')
        .select('blocked_date')
        .eq('coach_id', coachId);

      if (error) throw error;
      setBlockedDates(data?.map((item: any) => item.blocked_date) || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const getSpecificDateAvailability = (date: string): { isAvailable: boolean; times: string[] } => {
    // Week of June 9th, 2025
    const specificAvailability: { [key: string]: string[] } = {
      '2025-06-09': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'], // Monday 10am-3pm
      '2025-06-10': ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30'], // Tuesday 3pm-6pm
      '2025-06-11': ['13:00', '13:30', '14:00', '14:30'], // Wednesday 1pm-3pm
      '2025-06-12': ['10:30', '11:00', '11:30', '12:00', '12:30'], // Thursday 10:30am-1pm
      '2025-06-13': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'], // Friday 10am-4:30pm
      '2025-06-14': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'], // Saturday 10am-6pm
      
      // Following week (June 16-22, 2025) - 10am-1pm and 4pm-7pm
      '2025-06-16': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], // Monday
      '2025-06-17': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], // Tuesday
      '2025-06-18': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], // Wednesday
      '2025-06-19': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], // Thursday
      '2025-06-20': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], // Friday
      '2025-06-21': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], // Saturday
      '2025-06-22': ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'], // Sunday
    };

    if (specificAvailability[date]) {
      return {
        isAvailable: true,
        times: specificAvailability[date]
      };
    }

    return { isAvailable: false, times: [] };
  };

  const isDateAvailable = (date: string): boolean => {
    // Check specific date availability first
    const specificAvailability = getSpecificDateAvailability(date);
    if (specificAvailability.isAvailable) {
      return true;
    }

    // Check if date is blocked
    if (blockedDates.includes(date)) {
      return false;
    }
    
    // Check regular weekly availability
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find(slot => slot.day_of_week === dayOfWeek);
    return dayAvailability?.is_available || false;
  };

  const getAvailableTimesForDate = (date: string): string[] => {
    // Check specific date availability first
    const specificAvailability = getSpecificDateAvailability(date);
    if (specificAvailability.isAvailable) {
      return specificAvailability.times;
    }

    if (!isDateAvailable(date)) {
      return [];
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    const dayAvailability = availability.find(slot => slot.day_of_week === dayOfWeek);
    
    if (!dayAvailability || !dayAvailability.is_available) {
      return [];
    }

    // Generate time slots between start_time and end_time
    const times: string[] = [];
    const startTime = dayAvailability.start_time;
    const endTime = dayAvailability.end_time;
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + 30)) {
      const timeString = time.toTimeString().slice(0, 5);
      times.push(timeString);
    }
    
    return times;
  };

  return {
    availability,
    blockedDates,
    loading,
    isDateAvailable,
    getAvailableTimesForDate
  };
};
