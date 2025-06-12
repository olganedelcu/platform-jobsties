
import { supabase } from '@/integrations/supabase/client';
import { JobRecommendation } from '@/types/jobRecommendations';

export interface ArchiveJobRecommendationData {
  status: 'applied' | 'archived' | 'active';
  applied_date?: string;
  application_stage?: string;
}

export const updateJobRecommendationStatus = async (
  recommendationId: string, 
  updates: ArchiveJobRecommendationData
): Promise<JobRecommendation> => {
  // First, let's verify the recommendation exists and get user info
  const { data: existingRec, error: fetchError } = await supabase
    .from('weekly_job_recommendations')
    .select('*')
    .eq('id', recommendationId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (!existingRec) {
    throw new Error(`Job recommendation with ID ${recommendationId} not found`);
  }

  // Get current user to verify permissions
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Now perform the update
  const { data, error } = await supabase
    .from('weekly_job_recommendations')
    .update({
      status: updates.status,
      applied_date: updates.applied_date || null,
      application_stage: updates.application_stage || null,
      archived: updates.status === 'applied' || updates.status === 'archived'
    })
    .eq('id', recommendationId)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('Failed to update job recommendation. Please check your permissions.');
  }

  return data[0] as JobRecommendation;
};

export const markRecommendationAsApplied = async (
  recommendationId: string,
  applicationStage: string = 'applied'
): Promise<JobRecommendation> => {
  return updateJobRecommendationStatus(recommendationId, {
    status: 'applied',
    applied_date: new Date().toISOString(),
    application_stage: applicationStage
  });
};

export const archiveRecommendation = async (recommendationId: string): Promise<JobRecommendation> => {
  return updateJobRecommendationStatus(recommendationId, {
    status: 'archived'
  });
};

export const reactivateRecommendation = async (recommendationId: string): Promise<JobRecommendation> => {
  return updateJobRecommendationStatus(recommendationId, {
    status: 'active'
  });
};

export const fetchJobRecommendationsByStatus = async (
  userId: string,
  status?: 'active' | 'applied' | 'archived',
  isCoach: boolean = false
): Promise<JobRecommendation[]> => {
  let query = supabase
    .from('weekly_job_recommendations')
    .select('*')
    .order('created_at', { ascending: false });

  if (isCoach) {
    query = query.eq('coach_id', userId);
  } else {
    query = query.eq('mentee_id', userId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []) as JobRecommendation[];
};
