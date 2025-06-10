
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
    console.log('Current user email:', user.email);

    // Check if this is ana@jobsties.com - if so, show all applications
    if (user.email === 'ana@jobsties.com') {
      console.log('Ana detected - fetching all applications');
      
      // Fetch all job applications for Ana
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*')
        .order('date_applied', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching job applications:', applicationsError);
        throw applicationsError;
      }

      if (!applications || applications.length === 0) {
        console.log('No applications found');
        return [];
      }

      // Get all unique mentee IDs from applications
      const menteeIds = [...new Set(applications.map(app => app.mentee_id))];
      
      // Fetch profile information for each mentee
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', menteeIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine applications with profile data
      const applicationsWithProfiles = applications.map(application => ({
        ...application,
        profiles: profiles?.find(profile => profile.id === application.mentee_id) || null
      }));

      console.log('Found applications for Ana:', applicationsWithProfiles.length);
      return applicationsWithProfiles;
    }

    // For other coaches, use the existing assignment-based logic
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

    // Fetch job applications for assigned mentees
    const { data: applications, error: applicationsError } = await supabase
      .from('job_applications')
      .select('*')
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

    // Fetch profile information for each mentee
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', assignedMenteeIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Combine applications with profile data
    const applicationsWithProfiles = applications.map(application => ({
      ...application,
      profiles: profiles?.find(profile => profile.id === application.mentee_id) || null
    }));

    console.log('Found applications:', applicationsWithProfiles.length);
    console.log('Applications with profiles:', applicationsWithProfiles);

    return applicationsWithProfiles;
  } catch (error) {
    console.error('Error in fetchMenteeApplications:', error);
    throw error;
  }
};

export const updateCoachMenteeApplication = async (applicationId: string, updates: Partial<JobApplication>): Promise<void> => {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting current user:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Updating application:', applicationId, 'with updates:', updates);

    // Update the job application
    const { error: updateError } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating job application:', updateError);
      throw updateError;
    }

    console.log('Application updated successfully');
  } catch (error) {
    console.error('Error in updateCoachMenteeApplication:', error);
    throw error;
  }
};
