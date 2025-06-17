
import { AvailabilitySlot, BookedTimeSlots } from '@/types/availability';
import { CalComAvailabilityService } from '@/services/calComAvailabilityService';

export class AvailabilityUtils {
  static async checkDateAvailability(
    date: string,
    blockedDates: string[],
    availability: AvailabilitySlot[],
    coachId?: string
  ): Promise<boolean> {
    console.log('Checking availability for date:', date);
    
    // Use Cal.com availability service for date availability
    return await CalComAvailabilityService.checkDateAvailability(date);
  }

  static async getAvailableTimesForDate(
    date: string,
    availability: AvailabilitySlot[],
    bookedTimeSlots: BookedTimeSlots,
    isDateAvailable: boolean,
    coachId?: string
  ): Promise<string[]> {
    console.log('Getting available times for date:', date, 'isDateAvailable:', isDateAvailable);
    
    if (!isDateAvailable) {
      return [];
    }

    try {
      // Fetch available times from Cal.com
      const calComAvailableTimes = await CalComAvailabilityService.fetchAvailability(date);
      
      // Filter out already booked slots from our database
      const bookedForDate = bookedTimeSlots[date] || [];
      const availableTimes = calComAvailableTimes.filter(time => !bookedForDate.includes(time));
      
      console.log('Available times from Cal.com:', calComAvailableTimes);
      console.log('Booked times from database:', bookedForDate);
      console.log('Final available times:', availableTimes);
      
      return availableTimes;
    } catch (error) {
      console.error('Error getting available times:', error);
      return [];
    }
  }
}
