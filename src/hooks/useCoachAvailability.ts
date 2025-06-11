
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CoachCalendarService } from '@/services/coachCalendarService';

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
  isDateAvailable: (date: string) => Promise<boolean>;
  getAvailableTimesForDate: (date: string) => Promise<string[]>;
}

export const useCoachAvailability = (coachId?: string): UseCoachAvailabilityReturn => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coachId) {
      fetchAvailability();
      fetchBlockedDates();
    } else {
      setDefaultAvailability();
    }
    fetchBookedSessions();
  }, [coachId]);

  const setDefaultAvailability = () => {
    const defaultAvailability = [
      { id: '0', day_of_week: 0, start_time: '09:00', end_time: '17:00', is_available: false },
      { id: '1', day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '2', day_of_week: 2, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '3', day_of_week: 3, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '4', day_of_week: 4, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '5', day_of_week: 5, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '6', day_of_week: 6, start_time: '09:00', end_time: '17:00', is_available: false },
    ];
    setAvailability(defaultAvailability);
  };

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
      setDefaultAvailability();
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
      setBlockedDates(data?.map((item: any) => item.blocked_date) || []);
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    }
  };

  const fetchBookedSessions = async () => {
    try {
      const { data: sessions, error } = await supabase
        .from('coaching_sessions')
        .select('session_date, duration')
        .in('status', ['confirmed', 'pending']);

      if (error) {
        console.error('Error fetching booked sessions:', error);
        return;
      }

      const bookedSlots: { [key: string]: string[] } = {};
      
      sessions?.forEach(session => {
        const sessionDate = new Date(session.session_date);
        const dateKey = sessionDate.toISOString().split('T')[0];
        
        const startTime = sessionDate.toTimeString().slice(0, 5);
        const endTime = new Date(sessionDate.getTime() + (session.duration || 60) * 60000);
        const endTimeString = endTime.toTimeString().slice(0, 5);
        
        const sessionStart = new Date(`2000-01-01T${startTime}:00`);
        const sessionEnd = new Date(`2000-01-01T${endTimeString}:00`);
        
        if (!bookedSlots[dateKey]) {
          bookedSlots[dateKey] = [];
        }
        
        for (let time = new Date(sessionStart); time < sessionEnd; time.setMinutes(time.getMinutes() + 30)) {
          const timeString = time.toTimeString().slice(0, 5);
          if (!bookedSlots[dateKey].includes(timeString)) {
            bookedSlots[dateKey].push(timeString);
          }
        }
      });

      setBookedTimeSlots(bookedSlots);
      setLoading(false);
    } catch (error) {
      console.error('Error processing booked sessions:', error);
      setLoading(false);
    }
  };

  const isDateAvailable = async (date: string): Promise<boolean> => {
    if (blockedDates.includes(date)) {
      return false;
    }
    
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find(slot => slot.day_of_week === dayOfWeek);
    
    if (!dayAvailability?.is_available) {
      return false;
    }

    // Check calendar availability if coach ID is provided
    if (coachId) {
      try {
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;
        return await CoachCalendarService.checkAvailability(coachId, startOfDay, endOfDay);
      } catch (error) {
        console.error('Error checking calendar availability:', error);
        return false;
      }
    }

    return true;
  };

  const getAvailableTimesForDate = async (date: string): Promise<string[]> => {
    const available = await isDateAvailable(date);
    if (!available) {
      return [];
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    const dayAvailability = availability.find(slot => slot.day_of_week === dayOfWeek);
    
    if (!dayAvailability || !dayAvailability.is_available) {
      return [];
    }

    const times: string[] = [];
    const startTime = dayAvailability.start_time;
    const endTime = dayAvailability.end_time;
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + 30)) {
      const timeString = time.toTimeString().slice(0, 5);
      times.push(timeString);
    }
    
    const bookedForDate = bookedTimeSlots[date] || [];
    const availableTimes = times.filter(time => !bookedForDate.includes(time));

    // Further filter by checking individual time slots against calendar events
    if (coachId) {
      const finalAvailableTimes: string[] = [];
      
      for (const time of availableTimes) {
        const startTime = `${date}T${time}:00.000Z`;
        const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();
        
        try {
          const isSlotAvailable = await CoachCalendarService.checkAvailability(coachId, startTime, endTime);
          if (isSlotAvailable) {
            finalAvailableTimes.push(time);
          }
        } catch (error) {
          console.error('Error checking time slot availability:', error);
        }
      }
      
      return finalAvailableTimes;
    }

    return availableTimes;
  };

  return {
    availability,
    blockedDates,
    loading,
    isDateAvailable,
    getAvailableTimesForDate
  };
};
