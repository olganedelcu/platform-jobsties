
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import RoleSelector from './RoleSelector';
import SignUpFormFields from './SignUpFormFields';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MENTEE' as 'COACH' | 'MENTEE'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: 'COACH' | 'MENTEE') => {
    console.log('Role selected:', role);
    setFormData(prev => ({
      ...prev,
      role
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
      
      console.log('Submitting signup with role:', formData.role);
      
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

      console.log('Signup response:', { data, error });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('User created with metadata:', data.user.user_metadata);
        
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to confirm your account.",
        });
        
        // Redirect to login page after successful signup
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create account',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RoleSelector 
        selectedRole={formData.role}
        onRoleChange={handleRoleChange}
      />
      <SignUpFormFields 
        formData={formData}
        onChange={handleChange}
      />
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
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
      </div>
    </form>
  );
};

export default SignUpForm;
