
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const updateCoachMenteeApplication = async (applicationId: string, updates: Partial<JobApplication>): Promise<void> => {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Updating application:', applicationId, 'with updates:', updates);

    // Update the job application
    const { error: updateError } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating job application:', updateError);
      throw updateError;
    }

    console.log('Application updated successfully');
  } catch (error) {
    console.error('Error in updateCoachMenteeApplication:', error);
    throw error;
  }
};
