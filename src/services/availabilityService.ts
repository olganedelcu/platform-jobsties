
import { supabase } from '@/integrations/supabase/client';
import { AvailabilitySlot } from '@/types/availability';

export class AvailabilityService {
  static async fetchAvailability(coachId: string): Promise<AvailabilitySlot[]> {
    try {
      // If no valid coach ID, return default availability instead of querying
      if (!coachId || coachId === 'fallback') {
        return this.getDefaultAvailability();
      }

      const { data, error } = await supabase
        .from('coach_availability')
        .select('*')
        .eq('coach_id', coachId)
        .order('day_of_week');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  }

  static async fetchBlockedDates(coachId: string): Promise<string[]> {
    try {
      // If no valid coach ID, return empty array instead of querying
      if (!coachId || coachId === 'fallback') {
        return [];
      }

      const { data, error } = await supabase
        .from('coach_blocked_dates')
        .select('blocked_date')
        .eq('coach_id', coachId);

      if (error) throw error;
      return data?.map((item: { blocked_date: string }) => item.blocked_date) || [];
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
      throw error;
    }
  }

  static async fetchBookedSessions() {
    try {
      const { data: sessions, error } = await supabase
        .from('coaching_sessions')
        .select('session_date, duration')
        .in('status', ['confirmed', 'pending']);

      if (error) {
        console.error('Error fetching booked sessions:', error);
        return {};
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

      return bookedSlots;
    } catch (error) {
      console.error('Error processing booked sessions:', error);
      return {};
    }
  }

  static getDefaultAvailability(): AvailabilitySlot[] {
    return [
      { id: '0', day_of_week: 0, start_time: '09:00', end_time: '17:00', is_available: false },
      { id: '1', day_of_week: 1, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '2', day_of_week: 2, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '3', day_of_week: 3, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '4', day_of_week: 4, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '5', day_of_week: 5, start_time: '09:00', end_time: '17:00', is_available: true },
      { id: '6', day_of_week: 6, start_time: '09:00', end_time: '17:00', is_available: false },
    ];
  }
}
