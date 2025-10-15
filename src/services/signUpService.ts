
import { supabase } from '@/integrations/supabase/client';
import { SignUpFormData } from '@/hooks/useSignUpValidation';

export const createMenteeAccount = async (formData: SignUpFormData) => {
  console.log('Submitting validated mentee signup');
  
  // Create the user with metadata - Supabase will handle email confirmation automatically
  const { data, error } = await supabase.auth.signUp({
    email: formData.email.toLowerCase().trim(),
    password: formData.password,
    options: {
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
    console.log('Email confirmation status:', data.user.email_confirmed_at);
    return true;
  }
  
  return false;
};
