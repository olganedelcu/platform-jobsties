
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
  const { data, error } = await supabase
    .from('weekly_job_recommendations')
    .update({
      status: updates.status,
      applied_date: updates.applied_date || null,
      application_stage: updates.application_stage || null,
      archived: updates.status === 'applied' || updates.status === 'archived'
    })
    .eq('id', recommendationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating job recommendation status:', error);
    throw error;
  }

  return data;
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
    console.error('Error fetching job recommendations by status:', error);
    throw error;
  }

  return data || [];
};
