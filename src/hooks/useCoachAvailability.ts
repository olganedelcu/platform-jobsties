
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
    }
  }, [coachId]);

  const fetchAvailability = async () => {
    if (!coachId) return;

    try {
      const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .order('day_of_week');

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedDates = async () => {
    if (!coachId) return;

    try {
      const { data, error } = await supabase
        .from('coach_blocked_dates')
        .select('blocked_date')
        .eq('coach_id', coachId);

      if (error) throw error;
      setBlockedDates(data?.map(item => item.blocked_date) || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const isDateAvailable = (date: string): boolean => {
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    // Check if date is blocked
    if (blockedDates.includes(date)) {
      return false;
    }
    
    // Check if day of week is available
    const dayAvailability = availability.find(slot => slot.day_of_week === dayOfWeek);
    return dayAvailability?.is_available || false;
  };

  const getAvailableTimesForDate = (date: string): string[] => {
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
