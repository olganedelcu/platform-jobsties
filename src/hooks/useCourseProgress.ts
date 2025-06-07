
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CourseProgress {
  id: string;
  moduleTitle: string;
  completed: boolean;
  progressPercentage: number;
  completedAt?: string;
}

interface UseCourseProgressParams {
  id: string;
}

export const useCourseProgress = (params: UseCourseProgressParams) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course progress from database
  useEffect(() => {
    if (params?.id) {
      fetchProgress();
    }
  }, [params?.id]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching course progress for user:', params.id);
      
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', params.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Course progress data:', data);

      const formattedProgress = data?.map(item => ({
        id: item.id,
        moduleTitle: item.module_title,
        completed: item.completed || false,
        progressPercentage: item.progress_percentage || 0,
        completedAt: item.completed_at
      })) || [];

      setProgress(formattedProgress);
    } catch (error: any) {
      console.error('Error fetching course progress:', error);
      setError(error.message);
      
      // Only show toast for non-network errors to avoid spam
      if (!error.message?.includes('Failed to fetch')) {
        toast({
          title: "Error",
          description: "Failed to load course progress.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (moduleTitle: string, progressPercentage: number, completed?: boolean) => {
    try {
      console.log('Updating progress:', { moduleTitle, progressPercentage, completed });
      
      // Check if progress record exists
      const { data: existingProgress } = await supabase
        .from('course_progress')
        .select('id')
        .eq('user_id', params.id)
        .eq('module_title', moduleTitle)
        .single();

      const progressData = {
        user_id: params.id,
        module_title: moduleTitle,
        progress_percentage: progressPercentage,
        completed: completed || progressPercentage >= 100,
        completed_at: (completed || progressPercentage >= 100) ? new Date().toISOString() : null
      };

      if (existingProgress) {
        // Update existing record
        const { error } = await supabase
          .from('course_progress')
          .update(progressData)
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('course_progress')
          .insert(progressData);

        if (error) throw error;
      }

      await fetchProgress(); // Refresh the progress data
    } catch (error: any) {
      console.error('Error updating course progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive"
      });
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    fetchProgress
  };
};
