
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (coachId: string): Promise<JobApplication[]> => {
  // Get all applications from mentees with their profile information
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
      updated_at,
      profiles:mentee_id(first_name, last_name)
    `)
    .order('date_applied', { ascending: false });

  if (error) {
    throw error;
  }

  // Transform the data to match the JobApplication type
  const applications: JobApplication[] = data ? data.map(app => ({
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
    profiles: app.profiles && {
      first_name: app.profiles.first_name,
      last_name: app.profiles.last_name
    }
  })) : [];

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
