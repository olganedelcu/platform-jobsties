
import { useFormValidation } from '@/hooks/useFormValidation';
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

export const useSignUpValidation = () => {
  return useFormValidation<SignUpFormData>(
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
};

export type { SignUpFormData };
