
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SessionBasicDetailsProps {
  preferredCoach: string;
  onCoachChange: (coach: string) => void;
}

const SessionBasicDetails = ({ preferredCoach, onCoachChange }: SessionBasicDetailsProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="preferredCoach">Coach</Label>
      <Select value={preferredCoach} onValueChange={onCoachChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          <SelectItem value="Ana Nedelcu">Ana Nedelcu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SessionBasicDetails;
