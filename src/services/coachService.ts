
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCoachService = () => {
  const { toast } = useToast();

  const getCoachId = async (): Promise<string | null> => {
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
          // Check if Ana exists in auth.users but not in profiles
          toast({
            title: "Coach Setup Required",
            description: "Ana needs to complete her coach profile setup. Please contact support.",
            variant: "destructive"
          });
        }
        return null;
      }

      console.log('Found Ana profile:', profileData);
      
      // Check if Ana has the COACH role
      if (profileData.role !== 'COACH') {
        console.error('Ana does not have COACH role:', profileData.role);
        toast({
          title: "Invalid Coach Role",
          description: "Ana's account is not set up as a coach. Please contact support.",
          variant: "destructive"
        });
        return null;
      }

      console.log('Ana coach profile confirmed:', {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        name: `${profileData.first_name} ${profileData.last_name}`
      });
      
      return profileData.id;
    } catch (error) {
      console.error('Unexpected error in getCoachId:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to coach services. Please try again later.",
        variant: "destructive"
      });
      return null;
    }
  };

  return { getCoachId };
};
