
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@/types/sessions';

export const fetchSessions = async (userId: string): Promise<Session[]> => {
  console.log('Fetching sessions for user ID:', userId);
  
  const { data, error } = await supabase
    .from('coaching_sessions')
    .select('*')
    .eq('mentee_id', userId)
    .order('session_date', { ascending: true });

  console.log('Sessions query result:', { data, error });

  if (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }

  // Perform deduplication at the service level as well
  const deduplicatedData = data?.filter((session, index, self) => {
    // Remove duplicates by ID
    const isFirstOccurrenceById = index === self.findIndex(s => s.id === session.id);
    
    // If session has cal_com_booking_id, check for duplicates by that field
    if (session.cal_com_booking_id) {
      const isFirstOccurrenceByBookingId = index === self.findIndex(s => 
        s.cal_com_booking_id === session.cal_com_booking_id
      );
      return isFirstOccurrenceById && isFirstOccurrenceByBookingId;
    }
    
    // For sessions without cal_com_booking_id, check for duplicates by date and type
    const isFirstOccurrenceByDateTime = index === self.findIndex(s => 
      s.session_date === session.session_date && 
      s.session_type === session.session_type &&
      s.mentee_id === session.mentee_id
    );
    
    return isFirstOccurrenceById && isFirstOccurrenceByDateTime;
  }) || [];

  console.log('Found sessions after deduplication:', deduplicatedData.length);
  return deduplicatedData;
};
