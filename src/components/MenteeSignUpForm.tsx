
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SignUpFormFields from './SignUpFormFields';

const MenteeSignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MENTEE' as const
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
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your first and last name",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Submitting mentee signup with data:', {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role
      });
      
      // Get the current origin for email redirect
      const redirectUrl = `${window.location.origin}/login`;
      
      // Create the user with metadata and proper email redirect
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            role: formData.role
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created successfully:', data.user);
        
        // Show success message based on email confirmation status
        if (!data.user.email_confirmed_at) {
          toast({
            title: "Account Created Successfully!",
            description: "Please check your email and click the confirmation link to complete your registration.",
          });
        } else {
          toast({
            title: "Success!",
            description: "Your account has been created successfully. You can now log in.",
          });
        }
        
        // Redirect to login page after successful signup
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
        errorMessage = 'An account with this email already exists. Please try logging in instead.';
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message?.includes('Password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message?.includes('Email rate limit exceeded')) {
        errorMessage = 'Too many signup attempts. Please wait a moment and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SignUpFormFields 
        formData={formData}
        onChange={handleChange}
      />
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Mentee Account'}
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign in
          </button>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Are you a coach?{' '}
          <button
            type="button"
            onClick={() => navigate('/coach-signup')}
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            Sign up as coach
          </button>
        </p>
      </div>
    </form>
  );
};

export default MenteeSignUpForm;
