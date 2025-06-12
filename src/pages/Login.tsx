import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
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

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Attempting login with email:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      console.log('Login response:', { data, error });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      // Check user role and redirect appropriately
      if (data.user) {
        console.log('User logged in:', data.user);
        console.log('User metadata:', data.user.user_metadata);
        
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          console.log('Profile data:', profile);

          if (profileError) {
            console.log('Profile error, checking metadata fallback:', profileError);
            // Fallback to metadata
            const userRole = data.user.user_metadata?.role;
            console.log('User role from metadata:', userRole);
            
            if (userRole === 'COACH') {
              navigate('/coach/mentees');
            } else {
              navigate('/dashboard');
            }
          } else {
            console.log('User role from profile:', profile.role);
            if (profile.role === 'COACH') {
              navigate('/coach/mentees');
            } else {
              navigate('/dashboard');
            }
          }
        } catch (profileCheckError) {
          console.error('Error checking profile:', profileCheckError);
          // Default to dashboard on profile check error
          navigate('/dashboard');
        }

        toast({
          title: "Success",
          description: "Welcome back!",
        });
      }
      
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMessage = 'Failed to sign in';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-4 text-center bg-white rounded-t-lg px-6 py-8">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                alt="JobSties Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your account</CardDescription>
            <div className="h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 -mx-6"></div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}Contact{' '}
                  <a 
                    href="mailto:olga@jobsties.com" 
                    className="text-indigo-600 hover:text-indigo-500 font-medium underline"
                  >
                    olga@jobsties.com
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
