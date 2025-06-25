
import { supabase } from '@/integrations/supabase/client';
import { JobApplication, NewJobApplicationData } from '@/types/jobApplications';

export const fetchJobApplications = async (userId: string): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('mentee_id', userId)
    .order('date_applied', { ascending: false });

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }

  return data || [];
};

export const addJobApplication = async (userId: string, applicationData: NewJobApplicationData): Promise<JobApplication> => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      mentee_id: userId,
      ...applicationData
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding job application:', error);
    throw error;
  }

  return data;
};

export const updateJobApplication = async (userId: string, applicationId: string, updates: Partial<JobApplication>): Promise<JobApplication> => {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', applicationId)
    .eq('mentee_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating job application:', error);
    throw error;
  }

  return data;
};

export const deleteJobApplication = async (userId: string, applicationId: string): Promise<void> => {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', applicationId)
    .eq('mentee_id', userId);

  if (error) {
    console.error('Error deleting job application:', error);
    throw error;
  }
};
