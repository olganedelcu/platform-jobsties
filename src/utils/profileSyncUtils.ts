
import { supabase } from '@/integrations/supabase/client';

export const syncUserToProfile = async (userId: string) => {
  try {
    console.log('Syncing user to profile:', userId);
    
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle to avoid errors when no record exists
      
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
    
    // Create profile with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          email: user.email || '',
          role: user.user_metadata?.role === 'COACH' ? 'COACH' : 'MENTEE'
        });
        
      if (!insertError) {
        console.log('Successfully synced user to profile:', userId);
        return true;
      }
      
      console.error(`Error creating profile (attempt ${retryCount + 1}):`, insertError);
      
      // If it's a duplicate key error, the profile might have been created by another process
      if (insertError.code === '23505') {
        console.log('Profile already exists (duplicate key), checking again...');
        const { data: checkAgain } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
          
        if (checkAgain) {
          console.log('Profile confirmed to exist');
          return true;
        }
      }
      
      retryCount++;
      if (retryCount < maxRetries) {
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.error('Failed to create profile after all retries');
    return false;
    
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
