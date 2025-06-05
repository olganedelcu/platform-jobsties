
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CoachNavigation from '@/components/CoachNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Phone, Globe, Mail, Trash2 } from 'lucide-react';
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

const Mentees = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [deletingMentee, setDeletingMentee] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
        
        // Check if user is a coach
        if (session.user.user_metadata?.role !== 'COACH') {
          toast({
            title: "Access Denied",
            description: "You must be a coach to access this page.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }
        
        // Fetch mentees
        await fetchMentees();
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  const fetchMentees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'MENTEE')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mentees:', error);
        toast({
          title: "Error",
          description: "Failed to fetch mentees.",
          variant: "destructive"
        });
        return;
      }

      setMentees(data || []);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentees.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMentee = async (menteeId: string, menteeName: string) => {
    setDeletingMentee(menteeId);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', menteeId);

      if (error) {
        console.error('Error deleting mentee:', error);
        toast({
          title: "Error",
          description: "Failed to delete mentee.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${menteeName} has been removed successfully.`,
      });
      
      // Refresh the mentees list
      await fetchMentees();
    } catch (error) {
      console.error('Error deleting mentee:', error);
      toast({
        title: "Error",
        description: "Failed to delete mentee.",
        variant: "destructive"
      });
    } finally {
      setDeletingMentee(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Mentees</h1>
          <p className="text-gray-600 mt-2">Manage and track your mentees' progress</p>
          <div className="mt-4">
            <Badge variant="outline" className="text-sm">
              Total Mentees: {mentees.length}
            </Badge>
          </div>
        </div>

        {mentees.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No mentees yet</h2>
            <p className="text-gray-600">Mentees will appear here when they sign up to the platform.</p>
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
                          Active
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
                          <AlertDialogTitle>Delete Mentee</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {mentee.first_name} {mentee.last_name} from the platform? 
                            This action cannot be undone and will permanently delete their account and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMentee(mentee.id, `${mentee.first_name} ${mentee.last_name}`)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
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
    </div>
  );
};

export default Mentees;
