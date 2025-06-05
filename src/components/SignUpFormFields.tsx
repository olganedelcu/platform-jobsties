
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'COACH' | 'MENTEE';
}

interface SignUpFormFieldsProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SignUpFormFields = ({ formData, onChange }: SignUpFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            required
            placeholder="John"
            className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            required
            placeholder="Doe"
            className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
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
          onChange={onChange}
          required
          placeholder="Create a password"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={onChange}
          required
          placeholder="Confirm your password"
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </>
  );
};

export default SignUpFormFields;
