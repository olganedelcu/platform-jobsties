
import { supabase } from '@/integrations/supabase/client';

export const coachService = {
  async getCoachId(): Promise<{ success: boolean; coachId: string | null; error?: string }> {
    try {
      console.log('Looking for Ana coach profile...');
      
      // First, try to find Ana by email in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role, first_name, last_name')
        .eq('email', 'ana@jobsties.com')
        .single();

      if (profileError) {
        console.error('Profile lookup error:', profileError);
        
        if (profileError.code === 'PGRST116') {
          console.log('Ana profile not found in profiles table');
          return {
            success: false,
            coachId: null,
            error: 'COACH_SETUP_REQUIRED'
          };
        }
        return {
          success: false,
          coachId: null,
          error: 'PROFILE_LOOKUP_ERROR'
        };
      }

      console.log('Found Ana profile:', profileData);
      
      // Check if Ana has the COACH role
      if (profileData.role !== 'COACH') {
        console.error('Ana does not have COACH role:', profileData.role);
        return {
          success: false,
          coachId: null,
          error: 'INVALID_COACH_ROLE'
        };
      }

      console.log('Ana coach profile confirmed:', {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        name: `${profileData.first_name} ${profileData.last_name}`
      });
      
      return {
        success: true,
        coachId: profileData.id
      };
    } catch (error) {
      console.error('Unexpected error in getCoachId:', error);
      return {
        success: false,
        coachId: null,
        error: 'CONNECTION_ERROR'
      };
    }
  }
};
