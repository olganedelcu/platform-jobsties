
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useFormValidation } from '@/hooks/useFormValidation';
import { SecureInput } from '@/components/ui/secure-input';
import { supabase } from '@/integrations/supabase/client';
import { ValidationRules } from '@/utils/inputValidation';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationRules = {
  firstName: {
    required: true,
    type: 'text',
    minLength: 2,
    maxLength: 50,
    pattern: ValidationRules.noSpecialChars,
    patternMessage: 'First name can only contain letters, numbers, spaces, hyphens, and underscores'
  },
  lastName: {
    required: true,
    type: 'text',
    minLength: 2,
    maxLength: 50,
    pattern: ValidationRules.noSpecialChars,
    patternMessage: 'Last name can only contain letters, numbers, spaces, hyphens, and underscores'
  },
  email: {
    required: true,
    type: 'email'
  },
  password: {
    required: true,
    type: 'text',
    minLength: 8,
    maxLength: 128,
    custom: (value: string) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return {
          field: 'password',
          message: 'Password must contain uppercase, lowercase, numbers, and special characters',
          type: 'custom' as const
        };
      }
      return null;
    }
  },
  confirmPassword: {
    required: true,
    type: 'text',
    custom: (value: string, fieldName: string, allValues: any) => {
      if (value !== allValues?.password) {
        return {
          field: 'confirmPassword',
          message: 'Passwords do not match',
          type: 'custom' as const
        };
      }
      return null;
    }
  }
};

const ValidatedSignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { executeWithErrorHandling } = useErrorHandler();

  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    handleBlur,
    handleSubmit
  } = useFormValidation<SignUpFormData>(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationRules,
    {
      validateOnChange: true,
      validateOnBlur: true,
      sanitizeInputs: true
    }
  );

  const onSubmit = async (formData: SignUpFormData) => {
    const success = await executeWithErrorHandling(
      async () => {
        console.log('Submitting validated mentee signup');
        
        // Get the current origin for email redirect
        const redirectUrl = `${window.location.origin}/login`;
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              first_name: formData.firstName.trim(),
              last_name: formData.lastName.trim(),
              role: 'MENTEE'
            }
          }
        });

        if (error) {
          console.error('Signup error:', error);
          throw error;
        }

        if (data.user) {
          console.log('User created successfully:', data.user);
          
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
          
          navigate('/login');
          return true;
        }
        
        return false;
      },
      { 
        component: 'ValidatedSignUpForm', 
        action: 'signup' 
      }
    );

    if (!success) {
      toast({
        title: "Signup Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(onSubmit);
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
          <SecureInput
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={(e) => setValue('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            validationType="text"
            sanitizeOptions={{ maxLength: 50 }}
            placeholder="John"
            className={`border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${
              touched.firstName && errors.firstName ? 'border-red-500' : ''
            }`}
          />
          {touched.firstName && errors.firstName && (
            <p className="text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
          <SecureInput
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={(e) => setValue('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            validationType="text"
            sanitizeOptions={{ maxLength: 50 }}
            placeholder="Doe"
            className={`border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${
              touched.lastName && errors.lastName ? 'border-red-500' : ''
            }`}
          />
          {touched.lastName && errors.lastName && (
            <p className="text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <SecureInput
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          validationType="email"
          placeholder="Enter your email"
          className={`border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${
            touched.email && errors.email ? 'border-red-500' : ''
          }`}
        />
        {touched.email && errors.email && (
          <p className="text-xs text-red-600">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Password</Label>
        <SecureInput
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          sanitizeOptions={{ maxLength: 128 }}
          placeholder="Create a strong password"
          className={`border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${
            touched.password && errors.password ? 'border-red-500' : ''
          }`}
        />
        {touched.password && errors.password && (
          <p className="text-xs text-red-600">{errors.password}</p>
        )}
        <p className="text-xs text-gray-500">
          Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
        <SecureInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={(e) => setValue('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          sanitizeOptions={{ maxLength: 128 }}
          placeholder="Confirm your password"
          className={`border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 ${
            touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''
          }`}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <p className="text-xs text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Mentee Account'}
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

export default ValidatedSignUpForm;
