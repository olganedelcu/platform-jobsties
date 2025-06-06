
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (coachId: string): Promise<JobApplication[]> => {
  // Get all applications from mentees
  const { data, error } = await supabase
    .from('job_applications')
    .select('*, profiles:mentee_id(first_name, last_name)')
    .order('date_applied', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
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
