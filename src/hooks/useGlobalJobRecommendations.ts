import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GlobalJobRecommendation {
  id: string;
  job_title: string;
  company_name: string;
  description: string | null;
  job_link: string;
  week_start_date: string;
  status: string;
  created_at: string;
  mentee: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  coach: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export const useGlobalJobRecommendations = (userId: string | undefined) => {
  const [recommendations, setRecommendations] = useState<GlobalJobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      try {
        const { data, error } = await supabase
          .from('weekly_job_recommendations')
          .select(`
            *
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch profile data for mentees and coaches
        const menteeIds = [...new Set(data?.map(r => r.mentee_id).filter(Boolean))];
        const coachIds = [...new Set(data?.map(r => r.coach_id).filter(Boolean))];
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', [...menteeIds, ...coachIds]);

        const profileMap = new Map(profiles?.map(p => [p.id, p]));

        const enrichedData = data?.map(rec => ({
          id: rec.id,
          job_title: rec.job_title,
          company_name: rec.company_name,
          description: rec.description,
          job_link: rec.job_link,
          week_start_date: rec.week_start_date,
          status: rec.status || 'active',
          created_at: rec.created_at,
          mentee: profileMap.get(rec.mentee_id) || null,
          coach: profileMap.get(rec.coach_id) || null,
        })) || [];

        setRecommendations(enrichedData);
      } catch (error) {
        console.error('Error fetching global job recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return { recommendations, loading };
};
