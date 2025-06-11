
import { supabase } from '@/integrations/supabase/client';

export const hideCoachMenteeApplication = async (applicationId: string): Promise<void> => {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Attempting to hide application:', applicationId);

    // Use the RPC function to hide the application
    const { error: hideError } = await supabase.rpc('hide_application', {
      coach_user_id: user.id,
      app_id: applicationId
    });

    if (hideError) {
      console.error('Error hiding job application:', hideError);
      throw hideError;
    }

    console.log('Application hidden successfully from coach view:', applicationId);
  } catch (error) {
    console.error('Error in hideCoachMenteeApplication:', error);
    throw error;
  }
};
