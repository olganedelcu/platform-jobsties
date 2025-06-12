
import { AvailabilitySlot, BookedTimeSlots } from '@/types/availability';
import { CoachCalendarService } from '@/services/coachCalendarService';

export class AvailabilityUtils {
  static async checkDateAvailability(
    date: string,
    blockedDates: string[],
    availability: AvailabilitySlot[],
    coachId?: string
  ): Promise<boolean> {
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
  }

  static async getAvailableTimesForDate(
    date: string,
    availability: AvailabilitySlot[],
    bookedTimeSlots: BookedTimeSlots,
    isDateAvailable: boolean,
    coachId?: string
  ): Promise<string[]> {
    if (!isDateAvailable) {
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
  }
}
