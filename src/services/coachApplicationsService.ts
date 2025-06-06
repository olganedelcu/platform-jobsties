
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (coachId: string): Promise<JobApplication[]> => {
  // Get all applications from mentees with their profile information
  // Instead of using the foreign key relationship (which doesn't exist), 
  // we'll join the tables manually using a separate join query
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
    throw error;
  }

  // Fetch profiles separately for the mentees
  const applications: JobApplication[] = [];
  
  if (data && data.length > 0) {
    // Get unique mentee IDs
    const menteeIds = [...new Set(data.map(app => app.mentee_id))];
    
    // Fetch profiles for these mentees
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', menteeIds);
      
    if (profilesError) {
      throw profilesError;
    }
    
    // Create a map of profiles by ID for quick lookup
    const profilesMap = new Map();
    profilesData?.forEach(profile => {
      profilesMap.set(profile.id, {
        first_name: profile.first_name,
        last_name: profile.last_name
      });
    });
    
    // Combine applications with profile data
    applications.push(
      ...data.map(app => {
        const profile = profilesMap.get(app.mentee_id);
        return {
          id: app.id,
          mentee_id: app.mentee_id,
          date_applied: app.date_applied,
          company_name: app.company_name,
          job_title: app.job_title,
          application_status: app.application_status,
          interview_stage: app.interview_stage,
          recruiter_name: app.recruiter_name,
          coach_notes: app.coach_notes,
          created_at: app.created_at,
          updated_at: app.updated_at,
          profiles: profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name
          } : undefined
        };
      })
    );
  }

  return applications;
};

export const updateApplicationNotes = async (applicationId: string, coachNotes: string): Promise<void> => {
  const { error } = await supabase
    .from('job_applications')
    .update({ coach_notes: coachNotes })
    .eq('id', applicationId);

  if (error) {
    throw error;
  }
};
