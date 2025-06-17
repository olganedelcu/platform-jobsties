
interface CalComAvailabilitySlot {
  start: string;
  end: string;
}

interface CalComAvailabilityResponse {
  busy: CalComAvailabilitySlot[];
  timeZone: string;
}

export class CalComAvailabilityService {
  private static readonly CAL_COM_API_BASE = 'https://api.cal.com/v1';
  private static readonly ANA_USERNAME = 'ana-nedelcu'; // Ana's Cal.com username
  
  static async fetchAvailability(date: string): Promise<string[]> {
    try {
      console.log('Fetching Cal.com availability for date:', date);
      
      // For now, return default business hours since we need Cal.com API key
      // This should be replaced with actual Cal.com API call when configured
      const defaultAvailability = this.getDefaultBusinessHours();
      
      console.log('Using default availability:', defaultAvailability);
      return defaultAvailability;
    } catch (error) {
      console.error('Error fetching Cal.com availability:', error);
      return this.getDefaultBusinessHours();
    }
  }

  static async checkDateAvailability(date: string): Promise<boolean> {
    try {
      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();
      
      // Ana is available Monday to Friday (1-5)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
      }
      
      // Check if it's a past date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking date availability:', error);
      return false;
    }
  }

  private static getDefaultBusinessHours(): string[] {
    const times: string[] = [];
    
    // Business hours: 9 AM to 5 PM in 30-minute slots
    for (let hour = 9; hour < 17; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return times;
  }

  // This method would make actual Cal.com API calls when API key is available
  private static async fetchFromCalComAPI(date: string): Promise<CalComAvailabilityResponse> {
    const startTime = `${date}T00:00:00.000Z`;
    const endTime = `${date}T23:59:59.999Z`;
    
    // This would be the actual API call structure
    const response = await fetch(`${this.CAL_COM_API_BASE}/availability`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CAL_COM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      // Add query parameters for date range and user
    });
    
    if (!response.ok) {
      throw new Error(`Cal.com API error: ${response.status}`);
    }
    
    return response.json();
  }
}
