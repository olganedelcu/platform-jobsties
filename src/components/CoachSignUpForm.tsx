
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SignUpFormFields from './SignUpFormFields';

const CoachSignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'COACH' as const
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
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Submitting coach signup with role:', formData.role);
      console.log('Full form data:', {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role
      });
      
      // Create the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
          }
        }
      });

      console.log('Coach signup response:', { data, error });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('Coach user created with metadata:', data.user.user_metadata);
        
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verify the profile was created with the correct role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching created coach profile:', profileError);
        } else {
          console.log('Created coach profile with role:', profile.role);
        }
        
        toast({
          title: "Success",
          description: "Coach account created successfully! Please check your email to confirm your account.",
        });
        
        // Redirect to coach login page after successful signup
        navigate('/coach-login');
      }
    } catch (error: any) {
      console.error('Coach signup error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create coach account',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Coach Registration</h3>
        <p className="text-sm text-purple-600">
          You are registering as a coach. This will give you access to mentor mentees and manage coaching sessions.
        </p>
      </div>
      
      <SignUpFormFields 
        formData={formData}
        onChange={handleChange}
      />
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Coach Account...' : 'Create Coach Account'}
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have a coach account?{' '}
          <button
            type="button"
            onClick={() => navigate('/coach-login')}
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </form>
  );
};

export default CoachSignUpForm;
