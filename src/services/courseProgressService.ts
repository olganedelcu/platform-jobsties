
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

export const courseProgressService = {
  /**
   * Fetch course progress for a single user (used by mentee course page)
   */
  async fetchUserProgress(userId: string): Promise<CourseProgressData[]> {
    console.log('Fetching course progress for user:', userId);
    
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user course progress:', error);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      moduleTitle: item.module_title,
      completed: item.completed || false,
      progressPercentage: item.progress_percentage || 0,
      completedAt: item.completed_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },

  /**
   * Fetch course progress for multiple users (used by coach dashboard)
   */
  async fetchMenteeProgress(menteeIds: string[]): Promise<MenteeProgressSummary[]> {
    if (menteeIds.length === 0) {
      return [];
    }

    console.log('Fetching course progress for mentees:', menteeIds);
    
    // Fetch profiles to check email confirmation status
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', menteeIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw new Error(`Profile fetch error: ${profilesError.message}`);
    }

    // Fetch course progress for all mentees
    const { data: courseProgress, error: progressError } = await supabase
      .from('course_progress')
      .select('*')
      .in('user_id', menteeIds)
      .order('created_at', { ascending: false });

    if (progressError) {
      console.error('Error fetching mentee progress:', progressError);
      throw new Error(`Progress fetch error: ${progressError.message}`);
    }

    console.log('Raw course progress data:', courseProgress);
    console.log('Profiles data:', profiles);

    // Process the data for each mentee
    const summaries: MenteeProgressSummary[] = [];
    
    for (const menteeId of menteeIds) {
      const profile = profiles?.find(p => p.id === menteeId);
      const menteeProgressData = courseProgress?.filter(p => p.user_id === menteeId) || [];
      
      // Convert to CourseProgressData format
      const progressData: CourseProgressData[] = menteeProgressData.map(item => ({
        id: item.id,
        userId: item.user_id,
        moduleTitle: item.module_title,
        completed: item.completed || false,
        progressPercentage: item.progress_percentage || 0,
        completedAt: item.completed_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      // Calculate summary metrics using the same logic as mentee course page
      const completedModules = progressData.filter(p => p.completed).length;
      const totalModules = Math.max(progressData.length, 5); // Use actual module count or minimum 5
      const avgProgress = progressData.length > 0 
        ? progressData.reduce((sum, p) => sum + p.progressPercentage, 0) / progressData.length 
        : 0;
      const overallProgress = Math.round(avgProgress);
      const hasRealData = progressData.length > 0;
      const emailConfirmed = !!profile;

      console.log(`Mentee ${menteeId} progress: ${completedModules}/${totalModules} modules, ${overallProgress}% overall, hasRealData: ${hasRealData}`);

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
    console.log('Updating progress:', { userId, moduleTitle, progressPercentage, completed });
    
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
