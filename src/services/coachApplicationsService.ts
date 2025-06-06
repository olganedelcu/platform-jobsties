
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (): Promise<JobApplication[]> => {
  // Get all job applications with their profile information
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
    console.error('Error fetching mentee applications:', error);
    throw error;
  }

  // Properly type the response to match the JobApplication interface
  return (data as unknown) as JobApplication[];
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
