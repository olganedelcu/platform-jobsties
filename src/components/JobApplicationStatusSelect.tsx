
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobApplicationStatusSelectProps {
  value: 'applied' | 'interviewed' | 'offered' | 'rejected' | 'withdrawn';
  onValueChange: (value: 'applied' | 'interviewed' | 'offered' | 'rejected' | 'withdrawn') => void;
}

const JobApplicationStatusSelect = ({ value, onValueChange }: JobApplicationStatusSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="min-w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="applied">Applied</SelectItem>
        <SelectItem value="interviewed">Interviewed</SelectItem>
        <SelectItem value="offered">Offered</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
        <SelectItem value="withdrawn">Withdrawn</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default JobApplicationStatusSelect;
