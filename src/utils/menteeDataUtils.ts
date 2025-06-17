
// Helper function to get mentee details for notifications
export const getMenteeNotificationData = async (menteeId: string) => {
  console.log("📧 Getting mentee notification data for:", menteeId);
  
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data: mentee, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, id')
      .eq('id', menteeId)
      .single();

    if (error || !mentee) {
      console.error('❌ Error fetching mentee data:', error);
      return null;
    }

    const menteeData = {
      id: mentee.id,
      email: mentee.email,
      name: `${mentee.first_name} ${mentee.last_name}`.trim()
    };
    
    console.log("✅ Mentee data retrieved:", menteeData);
    return menteeData;
  } catch (error) {
    console.error('❌ Failed to get mentee notification data:', error);
    return null;
  }
};
