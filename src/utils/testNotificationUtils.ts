
import { supabase } from '@/integrations/supabase/client';

export interface RealMenteeData {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
}

export const fetchRealMenteeData = async (email: string): Promise<RealMenteeData | null> => {
  console.log('🔍 Fetching real mentee data for:', email);
  
  try {
    const { data: mentee, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('email', email)
      .ilike('role', 'mentee') // Use ilike for case-insensitive matching
      .single();

    if (error || !mentee) {
      console.error('❌ Error fetching mentee data:', error);
      
      // Let's also try a broader search to see what's in the database
      console.log('🔍 Trying broader search for debugging...');
      const { data: allWithEmail, error: debugError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role')
        .eq('email', email);
        
      console.log('🔍 All profiles with this email:', allWithEmail);
      
      if (allWithEmail && allWithEmail.length > 0) {
        // Find any mentee regardless of case
        const menteeProfile = allWithEmail.find(profile => 
          profile.role && profile.role.toLowerCase() === 'mentee'
        );
        
        if (menteeProfile) {
          console.log('✅ Found mentee with case-insensitive search:', menteeProfile);
          const menteeData = {
            id: menteeProfile.id,
            email: menteeProfile.email,
            name: `${menteeProfile.first_name} ${menteeProfile.last_name}`.trim(),
            first_name: menteeProfile.first_name,
            last_name: menteeProfile.last_name
          };
          return menteeData;
        }
      }
      
      return null;
    }

    const menteeData = {
      id: mentee.id,
      email: mentee.email,
      name: `${mentee.first_name} ${mentee.last_name}`.trim(),
      first_name: mentee.first_name,
      last_name: mentee.last_name
    };
    
    console.log("✅ Real mentee data retrieved:", menteeData);
    return menteeData;
  } catch (error) {
    console.error('❌ Failed to fetch real mentee data:', error);
    return null;
  }
};

export const createRealTestNotifications = (menteeData: RealMenteeData) => {
  return {
    jobRecommendation: {
      jobTitle: 'Senior Frontend Developer',
      companyName: 'TechCorp Solutions'
    },
    message: `Hi ${menteeData.first_name}! I've reviewed your latest job applications and have some great feedback. Your technical skills are really impressive, especially your React experience. I found a few companies that would be perfect matches for your background. Let's schedule a call this week to discuss your strategy and next steps.`,
    todoTitle: `Update LinkedIn profile with ${menteeData.first_name}'s recent project experience`,
    fileName: `Resume_${menteeData.first_name}_${menteeData.last_name}_Updated_2024.pdf`
  };
};
