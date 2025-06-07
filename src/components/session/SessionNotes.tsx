
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SessionNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const SessionNotes = ({ notes, onNotesChange }: SessionNotesProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Additional Notes</Label>
      <Textarea
        id="notes"
        placeholder="Any specific topics you'd like to discuss or preparation you've done..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
        rows={4}
      />
    </div>
  );
};

export default SessionNotes;
