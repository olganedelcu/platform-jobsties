
import { supabase } from '@/integrations/supabase/client';

export const syncUserToProfile = async (userId: string) => {
  try {
    console.log('Syncing user to profile:', userId);
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully
      
    if (checkError) {
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
    
    // Create profile with proper error handling
    const profileData = {
      id: user.id,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      email: user.email || '',
      role: user.user_metadata?.role === 'COACH' ? 'COACH' : 'MENTEE'
    };
    
    console.log('Creating profile with data:', profileData);
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileData);
      
    if (insertError) {
      console.error('Error creating profile:', insertError);
      // If it's a duplicate key error, that's actually fine - profile already exists
      if (insertError.code === '23505') {
        console.log('Profile already exists (duplicate key), continuing...');
        return true;
      }
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
    
    const syncResult = await syncUserToProfile(user.id);
    console.log('Profile sync completed:', syncResult);
    return syncResult;
  } catch (error) {
    console.error('Error in checkAndSyncCurrentUser:', error);
    return false;
  }
};
