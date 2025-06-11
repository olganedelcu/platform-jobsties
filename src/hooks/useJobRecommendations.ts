
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobRecommendation, NewJobRecommendationData } from '@/types/jobRecommendations';

interface UseJobRecommendationsParams {
  userId: string;
  isCoach?: boolean;
}

export const useJobRecommendations = ({ userId, isCoach = false }: UseJobRecommendationsParams) => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('weekly_job_recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (isCoach) {
        query = query.eq('coach_id', userId);
      } else {
        query = query.eq('mentee_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching job recommendations:', error);
        throw error;
      }

      setRecommendations(data || []);
    } catch (error: any) {
      console.error('Error fetching job recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load job recommendations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addRecommendation = async (recommendationData: NewJobRecommendationData) => {
    try {
      console.log('Adding recommendation:', {
        coach_id: userId,
        mentee_id: recommendationData.menteeId,
        job_title: recommendationData.jobTitle,
        job_link: recommendationData.jobLink,
        company_name: recommendationData.companyName,
        week_start_date: recommendationData.weekStartDate
      });

      const { data, error } = await supabase
        .from('weekly_job_recommendations')
        .insert({
          coach_id: userId,
          mentee_id: recommendationData.menteeId,
          job_title: recommendationData.jobTitle,
          job_link: recommendationData.jobLink,
          company_name: recommendationData.companyName,
          week_start_date: recommendationData.weekStartDate
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding job recommendation:', error);
        throw error;
      }

      console.log('Successfully added recommendation:', data);
      setRecommendations(prev => [data, ...prev]);
      
      return data;
    } catch (error: any) {
      console.error('Error adding job recommendation:', error);
      throw error; // Re-throw to let the caller handle it
    }
  };

  const deleteRecommendation = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('weekly_job_recommendations')
        .delete()
        .eq('id', recommendationId);

      if (error) {
        console.error('Error deleting job recommendation:', error);
        throw error;
      }

      setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
      
      toast({
        title: "Recommendation Deleted",
        description: "Job recommendation has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting job recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to delete job recommendation. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId, isCoach]);

  return {
    recommendations,
    loading,
    addRecommendation,
    deleteRecommendation,
    refetchRecommendations: fetchRecommendations
  };
};
