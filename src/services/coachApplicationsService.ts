
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (): Promise<JobApplication[]> => {
  try {
    // First, get all job applications
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        id,
        mentee_id,
        date_applied,
        company_name,
        job_title,
        application_status,
        interview_stage,
        recruiter_name,
        coach_notes,
        created_at,
        updated_at
      `)
      .order('date_applied', { ascending: false });

    if (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Get unique mentee IDs to fetch their profile information
    const menteeIds = [...new Set(data.map(app => app.mentee_id))];

    // Next, get profiles information for these mentees
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', menteeIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Map profiles to applications
    const applicationsWithProfiles = data.map(application => {
      const menteeProfile = profiles?.find(profile => profile.id === application.mentee_id) || null;
      
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
