
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mail, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

const MenteesContent = () => {
  const { toast } = useToast();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingMentee, setDeletingMentee] = useState<string | null>(null);

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    try {
      setLoading(true);
      
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive"
        });
        return;
      }

      // Get mentees assigned to this coach through the coach_mentee_assignments table
      const { data: assignments, error: assignmentsError } = await supabase
        .from('coach_mentee_assignments')
        .select(`
          mentee_id,
          profiles!coach_mentee_assignments_mentee_id_fkey (
            id,
            first_name,
            last_name,
            email,
            created_at
          )
        `)
        .eq('coach_id', user.id)
        .eq('is_active', true);

      if (assignmentsError) {
        console.error('Error fetching coach assignments:', assignmentsError);
        toast({
          title: "Error",
          description: "Failed to fetch assigned mentees.",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match the Mentee interface
      const assignedMentees = assignments?.map(assignment => ({
        id: assignment.profiles.id,
        first_name: assignment.profiles.first_name,
        last_name: assignment.profiles.last_name,
        email: assignment.profiles.email,
        created_at: assignment.profiles.created_at
      })) || [];

      console.log('Fetched assigned mentees:', assignedMentees);
      setMentees(assignedMentees);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentees.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMentee = async (menteeId: string, menteeName: string) => {
    setDeletingMentee(menteeId);
    
    try {
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive"
        });
        return;
      }

      // Remove the assignment instead of deleting the mentee profile
      const { error } = await supabase
        .from('coach_mentee_assignments')
        .update({ is_active: false })
        .eq('coach_id', user.id)
        .eq('mentee_id', menteeId);

      if (error) {
        console.error('Error removing mentee assignment:', error);
        toast({
          title: "Error",
          description: "Failed to remove mentee assignment.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${menteeName} has been removed from your mentee list.`,
      });
      
      // Refresh the mentees list
      await fetchMentees();
    } catch (error) {
      console.error('Error removing mentee assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove mentee assignment.",
        variant: "destructive"
      });
    } finally {
      setDeletingMentee(null);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="text-center">Loading assigned mentees...</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Assigned Mentees</h1>
        <p className="text-gray-600 mt-2">Manage and track your assigned mentees' progress</p>
        <div className="mt-4">
          <Badge variant="outline" className="text-sm">
            Assigned Mentees: {mentees.length}
          </Badge>
        </div>
      </div>

      {mentees.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No assigned mentees</h2>
          <p className="text-gray-600">You don't have any mentees assigned to you yet. Contact your administrator to get mentees assigned.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mentees.map((mentee) => (
            <Card key={mentee.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg">
                        {mentee.first_name[0]}{mentee.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{mentee.first_name} {mentee.last_name}</CardTitle>
                      <Badge variant="default" className="mt-1">
                        Assigned
                      </Badge>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingMentee === mentee.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Mentee Assignment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {mentee.first_name} {mentee.last_name} from your assigned mentees? 
                          This will not delete their account, but you will no longer be their assigned coach.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMentee(mentee.id, `${mentee.first_name} ${mentee.last_name}`)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove Assignment
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{mentee.email}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Progress</span>
                    <span className="text-sm text-gray-500">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(mentee.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default MenteesContent;
