
import { supabase } from '@/integrations/supabase/client';

export interface CourseProgressData {
  id: string;
  userId: string;
  moduleTitle: string;
  completed: boolean;
  progressPercentage: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenteeProgressSummary {
  menteeId: string;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  hasRealData: boolean;
  emailConfirmed: boolean;
  progressData: CourseProgressData[];
}

// Standard course modules that should be consistent across the platform
const STANDARD_COURSE_MODULES = [
  'CV Optimization',
  'LinkedIn & Cover Letter', 
  'Job Search Strategy',
  'Interview Preparation',
  'Feedback & Next Steps'
];

// Generate consistent sample progress data for a user
const generateSampleProgressData = (userId: string): CourseProgressData[] => {
  return [
    {
      id: `sample-1-${userId}`,
      userId,
      moduleTitle: 'CV Optimization',
      completed: true,
      progressPercentage: 100,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `sample-2-${userId}`,
      userId,
      moduleTitle: 'LinkedIn & Cover Letter',
      completed: true,
      progressPercentage: 100,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `sample-3-${userId}`,
      userId,
      moduleTitle: 'Job Search Strategy',
      completed: false,
      progressPercentage: 60,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `sample-4-${userId}`,
      userId,
      moduleTitle: 'Interview Preparation',
      completed: false,
      progressPercentage: 30,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `sample-5-${userId}`,
      userId,
      moduleTitle: 'Feedback & Next Steps',
      completed: false,
      progressPercentage: 0,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const courseProgressService = {
  /**
   * Fetch course progress for a single user (used by mentee course page)
   */
  async fetchUserProgress(userId: string): Promise<CourseProgressData[]> {
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const realProgressData = (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      moduleTitle: item.module_title,
      completed: item.completed || false,
      progressPercentage: item.progress_percentage || 0,
      completedAt: item.completed_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));

    // If no real data exists, return sample data for demonstration
    if (realProgressData.length === 0) {
      return generateSampleProgressData(userId);
    }

    return realProgressData;
  },

  /**
   * Fetch course progress for multiple users (used by coach dashboard)
   */
  async fetchMenteeProgress(menteeIds: string[]): Promise<MenteeProgressSummary[]> {
    if (menteeIds.length === 0) {
      return [];
    }
    
    // Fetch profiles to check email confirmation status
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', menteeIds);

    if (profilesError) {
      throw new Error(`Profile fetch error: ${profilesError.message}`);
    }

    // Fetch course progress for all mentees
    const { data: courseProgress, error: progressError } = await supabase
      .from('course_progress')
      .select('*')
      .in('user_id', menteeIds)
      .order('created_at', { ascending: false });

    if (progressError) {
      throw new Error(`Progress fetch error: ${progressError.message}`);
    }

    // Process the data for each mentee
    const summaries: MenteeProgressSummary[] = [];
    
    for (const menteeId of menteeIds) {
      const profile = profiles?.find(p => p.id === menteeId);
      const menteeProgressData = courseProgress?.filter(p => p.user_id === menteeId) || [];
      
      let progressData: CourseProgressData[];
      let hasRealData: boolean;

      if (menteeProgressData.length === 0) {
        // Use the same sample data that the individual course page would show
        progressData = generateSampleProgressData(menteeId);
        hasRealData = false;
      } else {
        // Convert real data to CourseProgressData format
        progressData = menteeProgressData.map(item => ({
          id: item.id,
          userId: item.user_id,
          moduleTitle: item.module_title,
          completed: item.completed || false,
          progressPercentage: item.progress_percentage || 0,
          completedAt: item.completed_at,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        hasRealData = true;
      }

      // Calculate summary metrics using the same logic as mentee course page
      const completedModules = progressData.filter(p => p.completed).length;
      const totalModules = Math.max(progressData.length, STANDARD_COURSE_MODULES.length);
      const avgProgress = progressData.length > 0 
        ? progressData.reduce((sum, p) => sum + p.progressPercentage, 0) / progressData.length 
        : 0;
      const overallProgress = Math.round(avgProgress);
      const emailConfirmed = !!profile;

      summaries.push({
        menteeId,
        overallProgress,
        completedModules,
        totalModules,
        hasRealData,
        emailConfirmed,
        progressData
      });
    }

    return summaries;
  },

  /**
   * Update course progress for a user
   */
  async updateProgress(userId: string, moduleTitle: string, progressPercentage: number, completed?: boolean): Promise<void> {
    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('course_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('module_title', moduleTitle)
      .single();

    const progressData = {
      user_id: userId,
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
  }
};
