
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (): Promise<JobApplication[]> => {
  console.log('fetchMenteeApplications: Starting to fetch applications...');
  
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles:mentee_id (
          id,
          first_name,
          last_name
        )
      `)
      .order('date_applied', { ascending: false });

    if (error) {
      console.error('fetchMenteeApplications: Error from Supabase:', error);
      throw error;
    }

    console.log('fetchMenteeApplications: Raw data from Supabase:', data);
    console.log('fetchMenteeApplications: Data length:', data?.length || 0);

    if (!data || data.length === 0) {
      console.log('fetchMenteeApplications: No data returned from Supabase');
      return [];
    }

    // Type cast the application_status to ensure it matches our type
    const formattedData = data.map(item => ({
      ...item,
      application_status: item.application_status as JobApplication['application_status']
    }));

    console.log('fetchMenteeApplications: Formatted data:', formattedData);
    console.log('fetchMenteeApplications: Sample item:', formattedData[0]);
    
    return formattedData;
  } catch (error) {
    console.error('fetchMenteeApplications: Caught error:', error);
    throw error;
  }
};

export const updateCoachMenteeApplication = async (
  applicationId: string, 
  updates: Partial<JobApplication>
): Promise<JobApplication> => {
  console.log('updateCoachMenteeApplication: Updating application', applicationId, 'with updates:', updates);
  
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();

  if (error) {
    console.error('updateCoachMenteeApplication: Error updating application:', error);
    throw error;
  }

  console.log('updateCoachMenteeApplication: Updated application:', data);
  return {
    ...data,
    application_status: data.application_status as JobApplication['application_status']
  };
};

export const hideCoachMenteeApplication = async (applicationId: string): Promise<void> => {
  console.log('hideCoachMenteeApplication: Starting hide process for application:', applicationId);
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('hideCoachMenteeApplication: User authentication error:', userError);
      throw new Error('User not authenticated');
    }

    console.log('hideCoachMenteeApplication: Authenticated user:', user.id);

    // Check if already hidden
    const { data: existingHidden, error: checkError } = await supabase
      .from('coach_hidden_applications')
      .select('id')
      .eq('coach_id', user.id)
      .eq('application_id', applicationId)
      .maybeSingle();

    if (checkError) {
      console.error('hideCoachMenteeApplication: Error checking existing hidden record:', checkError);
      throw checkError;
    }

    if (existingHidden) {
      console.log('hideCoachMenteeApplication: Application already hidden');
      return;
    }

    // Hide the application
    const { error: hideError } = await supabase
      .from('coach_hidden_applications')
      .insert({
        coach_id: user.id,
        application_id: applicationId
      });

    if (hideError) {
      console.error('hideCoachMenteeApplication: Error hiding application:', hideError);
      throw hideError;
    }

    console.log('hideCoachMenteeApplication: Successfully hidden application:', applicationId);
  } catch (error) {
    console.error('hideCoachMenteeApplication: Caught error:', error);
    throw error;
  }
};
