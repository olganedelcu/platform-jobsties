
import { useState, useEffect } from 'react';
import { courseProgressService, CourseProgressData } from '@/services/courseProgressService';

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
      
      const data = await courseProgressService.fetchUserProgress(params.id);

      if (!data || data.length === 0) {
        console.log('No course progress found, creating sample data for user:', params.id);
        
        // If no real data exists, create some sample progress for demonstration
        const sampleProgress = [
          {
            id: `sample-1-${params.id}`,
            moduleTitle: 'Resume Building',
            completed: true,
            progressPercentage: 100,
            completedAt: new Date().toISOString()
          },
          {
            id: `sample-2-${params.id}`,
            moduleTitle: 'Interview Preparation',
            completed: true,
            progressPercentage: 100,
            completedAt: new Date().toISOString()
          },
          {
            id: `sample-3-${params.id}`,
            moduleTitle: 'Networking Skills',
            completed: false,
            progressPercentage: 60,
            completedAt: undefined
          },
          {
            id: `sample-4-${params.id}`,
            moduleTitle: 'Job Search Strategy',
            completed: false,
            progressPercentage: 30,
            completedAt: undefined
          },
          {
            id: `sample-5-${params.id}`,
            moduleTitle: 'Career Development',
            completed: false,
            progressPercentage: 0,
            completedAt: undefined
          }
        ];
        
        setProgress(sampleProgress);
        return;
      }

      const formattedProgress = data.map(item => ({
        id: item.id,
        moduleTitle: item.moduleTitle,
        completed: item.completed,
        progressPercentage: item.progressPercentage,
        completedAt: item.completedAt
      }));

      setProgress(formattedProgress);
    } catch (error: unknown) {
      console.error('Error fetching course progress:', error);
      setError(error.message);
      
      // Set sample data on error
      const errorFallbackProgress = [
        {
          id: `fallback-1-${params.id}`,
          moduleTitle: 'Resume Building',
          completed: false,
          progressPercentage: 25,
          completedAt: undefined
        },
        {
          id: `fallback-2-${params.id}`,
          moduleTitle: 'Interview Preparation',
          completed: false,
          progressPercentage: 0,
          completedAt: undefined
        }
      ];
      
      setProgress(errorFallbackProgress);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (moduleTitle: string, progressPercentage: number, completed?: boolean) => {
    try {
      await courseProgressService.updateProgress(params.id, moduleTitle, progressPercentage, completed);
      await fetchProgress(); // Refresh the progress data
    } catch (error: unknown) {
      console.error('Error updating course progress:', error);
      setError(error.message);
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
