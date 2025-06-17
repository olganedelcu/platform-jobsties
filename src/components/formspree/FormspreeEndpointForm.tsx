
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormspreeEndpointFormProps {
  endpoint: string;
  onEndpointChange: (endpoint: string) => void;
}

const FormspreeEndpointForm = ({ endpoint, onEndpointChange }: FormspreeEndpointFormProps) => {
  return (
    <div>
      <Label htmlFor="formspree-endpoint">Formspree Form Endpoint</Label>
      <Input
        id="formspree-endpoint"
        type="url"
        placeholder="https://formspree.io/f/myzjjlvn"
        value={endpoint}
        onChange={(e) => onEndpointChange(e.target.value)}
        className="mt-1"
      />
      <p className="text-sm text-gray-500 mt-1">
        Your endpoint is configured and active
      </p>
    </div>
  );
};

export default FormspreeEndpointForm;
