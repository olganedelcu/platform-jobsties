
import { supabase } from '@/integrations/supabase/client';

export const syncUserToProfile = async (userId: string) => {
  try {
    console.log('Syncing user to profile:', userId);
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing profile:', checkError);
      return false;
    }
    
    if (existingProfile) {
      console.log('Profile already exists for user:', userId);
      return true;
    }
    
    // Get user data from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user || user.id !== userId) {
      console.error('Error getting user data or user mismatch:', userError);
      return false;
    }
    
    // Create profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        email: user.email || '',
        role: user.user_metadata?.role === 'COACH' ? 'COACH' : 'MENTEE'
      });
      
    if (insertError) {
      console.error('Error creating profile:', insertError);
      return false;
    }
    
    console.log('Successfully synced user to profile:', userId);
    return true;
    
  } catch (error) {
    console.error('Error in syncUserToProfile:', error);
    return false;
  }
};

export const checkAndSyncCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.log('No authenticated user found');
      return false;
    }
    
    return await syncUserToProfile(user.id);
  } catch (error) {
    console.error('Error in checkAndSyncCurrentUser:', error);
    return false;
  }
};
