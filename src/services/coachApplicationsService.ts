
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (): Promise<JobApplication[]> => {
  try {
    // Fetch all job applications with mentee profile information
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles:mentee_id(
          first_name,
          last_name,
          email
        )
      `)
      .order('date_applied', { ascending: false });

    if (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to include profile information
    const applicationsWithProfiles = data.map(application => {
      const menteeProfile = application.profiles as any;
      
      return {
        ...application,
        profiles: menteeProfile ? {
          first_name: menteeProfile.first_name,
          last_name: menteeProfile.last_name
        } : null
      };
    });

    return applicationsWithProfiles;
  } catch (error) {
    console.error('Error in fetchMenteeApplications:', error);
    throw error;
  }
};

export const updateApplicationNotes = async (applicationId: string, coachNotes: string): Promise<void> => {
  const { error } = await supabase
    .from('job_applications')
    .update({ coach_notes: coachNotes })
    .eq('id', applicationId);

  if (error) {
    console.error('Error updating application notes:', error);
    throw error;
  }
};
