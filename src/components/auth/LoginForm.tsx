
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { checkAndSyncCurrentUser } from '@/utils/profileSyncUtils';
import LoginFooter from './LoginFooter';

const LoginForm = () => {
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
        
        // Try to sync the user to profiles table if needed
        console.log('Attempting to sync user to profiles...');
        const syncResult = await checkAndSyncCurrentUser();
        console.log('Profile sync result:', syncResult);
        
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

      <LoginFooter />
    </form>
  );
};

export default LoginForm;
