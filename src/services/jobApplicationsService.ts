
import { supabase } from '@/integrations/supabase/client';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';

export const fetchJobApplications = async (userId: string): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('mentee_id', userId)
    .order('date_applied', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const addJobApplication = async (userId: string, applicationData: NewJobApplicationData): Promise<JobApplication> => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      mentee_id: userId,
      date_applied: applicationData.dateApplied,
      company_name: applicationData.companyName,
      job_title: applicationData.jobTitle,
      application_status: applicationData.applicationStatus,
      interview_stage: applicationData.interviewStage || null,
      recruiter_name: applicationData.recruiterName || null,
      coach_notes: applicationData.coachNotes || null,
      mentee_notes: applicationData.menteeNotes || null
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateJobApplication = async (userId: string, applicationId: string, updates: Partial<JobApplication>): Promise<void> => {
  const { error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', applicationId)
    .eq('mentee_id', userId);

  if (error) {
    throw error;
  }
};

export const deleteJobApplication = async (userId: string, applicationId: string): Promise<void> => {
  const { error } = await supabase
    .delete()
    .from('job_applications')
    .eq('id', applicationId)
    .eq('mentee_id', userId);

  if (error) {
    throw error;
  }
};
