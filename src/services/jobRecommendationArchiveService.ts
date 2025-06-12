
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
  console.log('Updating job recommendation:', recommendationId, updates);
  
  // First, let's verify the recommendation exists and get user info
  const { data: existingRec, error: fetchError } = await supabase
    .from('weekly_job_recommendations')
    .select('*')
    .eq('id', recommendationId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching job recommendation:', fetchError);
    throw fetchError;
  }

  if (!existingRec) {
    console.error('Job recommendation not found:', recommendationId);
    throw new Error(`Job recommendation with ID ${recommendationId} not found`);
  }

  console.log('Found existing recommendation:', existingRec);

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
    console.error('Error updating job recommendation status:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    console.error('No job recommendation updated. This might be a permissions issue.');
    throw new Error('Failed to update job recommendation. Please check your permissions.');
  }

  console.log('Successfully updated job recommendation:', data[0]);
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
  console.log('Fetching job recommendations:', { userId, status, isCoach });
  
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
    console.error('Error fetching job recommendations by status:', error);
    throw error;
  }

  console.log('Fetched job recommendations:', data);
  return (data || []) as JobRecommendation[];
};
