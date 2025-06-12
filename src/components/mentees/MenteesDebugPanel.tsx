
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { checkAndSyncCurrentUser } from '@/utils/profileSyncUtils';
import { assignAllMenteesToCurrentCoach } from '@/utils/menteeAssignmentUtils';

interface MenteesDebugPanelProps {
  onRefresh: () => Promise<void>;
}

const MenteesDebugPanel = ({ onRefresh }: MenteesDebugPanelProps) => {
  const { toast } = useToast();
  const [isAssigning, setIsAssigning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);

  const handleAssignMentees = async () => {
    setIsAssigning(true);
    const success = await assignAllMenteesToCurrentCoach(toast);
    if (success) {
      await onRefresh();
    }
    setIsAssigning(false);
  };

  const handleDebugData = async () => {
    setIsDebugging(true);
    
    try {
      console.log('=== DEBUG: Starting comprehensive data check ===');
      
      // Check current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', user);
      console.log('User error:', userError);
      
      if (user) {
        // Check if current user has a profile
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        console.log('Current user profile:', userProfile);
        console.log('Profile error:', profileError);
        
        // If no profile, try to sync
        if (profileError && profileError.code === 'PGRST116') {
          console.log('No profile found for current user, attempting to sync...');
          const syncResult = await checkAndSyncCurrentUser();
          console.log('Sync result:', syncResult);
        }
      }
      
      // Check all profiles
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('*');
        
      console.log('All profiles in database:', allProfiles);
      console.log('All profiles error:', allProfilesError);
      
      // Check mentee assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('coach_mentee_assignments')
        .select('*');
        
      console.log('All coach-mentee assignments:', assignments);
      console.log('Assignments error:', assignmentsError);
      
      // Check coaching sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('coaching_sessions')
        .select('mentee_id, coach_id')
        .limit(10);
        
      console.log('Recent coaching sessions:', sessions);
      console.log('Sessions error:', sessionsError);
      
      console.log('=== DEBUG: Data check complete ===');
      
      toast({
        title: "Debug Complete",
        description: "Check the browser console for detailed information.",
      });
      
    } catch (error) {
      console.error('Error during debug:', error);
      toast({
        title: "Debug Error",
        description: "An error occurred during debugging. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsDebugging(false);
    }
  };

  return (
    <Card>
      <CardContent className="py-6">
        <div className="text-center space-y-4">
          <p className="text-gray-600 mb-4">
            If there are mentees in the system that should be displayed, try these options:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleAssignMentees}
              disabled={isAssigning}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isAssigning ? 'animate-spin' : ''}`} />
              <span>
                {isAssigning ? 'Loading Mentees...' : 'Load All Mentees from Profiles'}
              </span>
            </Button>
            
            <Button 
              onClick={handleDebugData}
              disabled={isDebugging}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Bug className={`h-4 w-4 ${isDebugging ? 'animate-spin' : ''}`} />
              <span>
                {isDebugging ? 'Debugging...' : 'Debug Data Issues'}
              </span>
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            The debug button will log detailed information to the browser console
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenteesDebugPanel;
