
import React from 'react';
import { Label } from '@/components/ui/label';
import { SecureInput } from '@/components/ui/secure-input';
import { SignUpFormData } from '@/hooks/useSignUpValidation';

interface SignUpFormFieldsProps {
  values: SignUpFormData;
  errors: Partial<Record<keyof SignUpFormData, string>>;
  touched: Partial<Record<keyof SignUpFormData, boolean>>;
  setValue: (field: keyof SignUpFormData, value: string) => void;
  handleBlur: (field: keyof SignUpFormData) => void;
}

const SignUpFormFields = ({ 
  values, 
  errors, 
  touched, 
  setValue, 
  handleBlur 
}: SignUpFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default SignUpFormFields;
