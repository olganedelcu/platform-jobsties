
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/jobApplications';

export const fetchMenteeApplications = async (): Promise<JobApplication[]> => {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Current user ID:', user.id);

    // First, get the mentees assigned to this coach
    const { data: assignments, error: assignmentsError } = await supabase
      .from('coach_mentee_assignments')
      .select('mentee_id')
      .eq('coach_id', user.id)
      .eq('is_active', true);

    if (assignmentsError) {
      console.error('Error fetching coach assignments:', assignmentsError);
      throw assignmentsError;
    }

    if (!assignments || assignments.length === 0) {
      console.log('No mentees assigned to this coach');
      return [];
    }

    const assignedMenteeIds = assignments.map(assignment => assignment.mentee_id);
    console.log('Assigned mentee IDs:', assignedMenteeIds);

    // Fetch job applications for assigned mentees only
    const { data: applications, error: applicationsError } = await supabase
      .from('job_applications')
      .select(`
        *,
        profiles!job_applications_mentee_id_fkey (
          first_name,
          last_name
        )
      `)
      .in('mentee_id', assignedMenteeIds)
      .order('date_applied', { ascending: false });

    if (applicationsError) {
      console.error('Error fetching job applications:', applicationsError);
      throw applicationsError;
    }

    if (!applications || applications.length === 0) {
      console.log('No applications found for assigned mentees');
      return [];
    }

    console.log('Found applications:', applications.length);
    console.log('Applications with profiles:', applications);

    return applications;
  } catch (error) {
    console.error('Error in fetchMenteeApplications:', error);
    throw error;
  }
};
