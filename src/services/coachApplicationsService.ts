
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (): Promise<JobApplication[]> => {
  try {
    // First fetch all job applications
    const { data: applications, error: applicationsError } = await supabase
      .from('job_applications')
      .select('*')
      .order('date_applied', { ascending: false });

    if (applicationsError) {
      console.error('Error fetching job applications:', applicationsError);
      throw applicationsError;
    }

    if (!applications || applications.length === 0) {
      return [];
    }

    // Get unique mentee IDs from applications
    const menteeIds = [...new Set(applications.map(app => app.mentee_id))];
    
    // Fetch mentee profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', menteeIds);

    if (profilesError) {
      console.error('Error fetching mentee profiles:', profilesError);
      throw profilesError;
    }

    // Create a map of mentee profiles for easy lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.id, profile);
    });

    // Transform applications to include mentee information
    const applicationsWithProfiles = applications.map(application => {
      const menteeProfile = profileMap.get(application.mentee_id);
      
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
