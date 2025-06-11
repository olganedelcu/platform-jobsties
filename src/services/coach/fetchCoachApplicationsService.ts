
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
      
      // Fetch all job applications for Ana (RLS policies will handle access)
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*')
        .order('date_applied', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching job applications:', applicationsError);
        throw applicationsError;
      }

      if (!applications || applications.length === 0) {
        console.log('No applications found in database');
        return [];
      }

      // Get all unique mentee IDs from applications
      const menteeIds = [...new Set(applications.map(app => app.mentee_id))];
      console.log('Unique mentee IDs:', menteeIds);
      
      // Fetch profile information for each mentee
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', menteeIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Don't throw error, just continue without profile data
      }

      console.log('Profiles fetched:', profiles);

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

    // Get hidden applications for this coach using the new RPC function
    const { data: hiddenApplications, error: hiddenError } = await supabase.rpc('get_hidden_applications', { coach_user_id: user.id });

    let hiddenApplicationIds: string[] = [];
    if (hiddenError) {
      console.error('Error fetching hidden applications:', hiddenError);
      // Don't throw error, just continue without filtering
      hiddenApplicationIds = [];
    } else {
      hiddenApplicationIds = hiddenApplications?.map((hidden: any) => hidden.application_id) || [];
    }

    console.log('Hidden application IDs:', hiddenApplicationIds);

    // Filter out hidden applications
    const visibleApplications = applications.filter(app => !hiddenApplicationIds.includes(app.id));
    console.log('Visible applications after filtering:', visibleApplications.length);

    // Fetch profile information for each mentee
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', assignedMenteeIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Don't throw error, just continue without profile data
    }

    // Combine applications with profile data
    const applicationsWithProfiles = visibleApplications.map(application => ({
      ...application,
      profiles: profiles?.find(profile => profile.id === application.mentee_id) || null
    }));

    console.log('Found applications:', applicationsWithProfiles.length);

    return applicationsWithProfiles;
  } catch (error) {
    console.error('Error in fetchMenteeApplications:', error);
    throw error;
  }
};
