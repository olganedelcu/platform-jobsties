
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SessionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SessionTypeSelector = ({ value, onChange }: SessionTypeSelectorProps) => {
  const sessionTypes = [
    'CV Review',
    'Interview Preparation', 
    'Job Search Strategy'
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="sessionType">Session Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select session type" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {sessionTypes.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SessionTypeSelector;
