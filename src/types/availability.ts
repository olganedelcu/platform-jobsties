
export interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface UseCoachAvailabilityReturn {
  availability: AvailabilitySlot[];
  blockedDates: string[];
  loading: boolean;
  isDateAvailable: (date: string) => Promise<boolean>;
  getAvailableTimesForDate: (date: string) => Promise<string[]>;
}

export interface BookedTimeSlots {
  [key: string]: string[];
}
