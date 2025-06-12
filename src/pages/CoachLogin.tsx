
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CoachLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        throw error;
      }

      // Verify this is actually a coach
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          toast({
            title: "Error",
            description: "Unable to verify coach status",
            variant: "destructive"
          });
          return;
        }

        if (profile.role !== 'COACH') {
          toast({
            title: "Access Denied",
            description: "This account is not registered as a coach",
            variant: "destructive"
          });
          await supabase.auth.signOut();
          return;
        }

        toast({
          title: "Welcome Back, Coach!",
          description: "Successfully signed in to your coaching dashboard.",
        });
        
        navigate('/coach/mentees');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to sign in',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg px-6 py-8">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/09eb05af-ad26-4901-aafd-0d84888e4010.png" 
                alt="JobSties Logo" 
                className="h-16 w-auto filter brightness-0 invert"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Coach Portal</CardTitle>
            <CardDescription className="text-purple-100">
              Access your coaching dashboard
            </CardDescription>
            <div className="h-[2px] bg-gradient-to-r from-white/30 to-white/10 -mx-6"></div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your coach email"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In to Coach Portal'}
              </Button>

              <div className="text-center mt-6 space-y-3">
                <p className="text-sm text-gray-600">
                  Don't have a coach account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/coach-signup')}
                    className="text-purple-600 hover:text-purple-500 font-medium"
                  >
                    Register as coach
                  </button>
                </p>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Are you a mentee?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachLogin;
