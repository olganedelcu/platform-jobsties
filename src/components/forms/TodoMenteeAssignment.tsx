
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface TodoMenteeAssignmentProps {
  mentees: Mentee[];
  assignToMentees: boolean;
  selectedMentees: string[];
  onAssignToMenteesChange: (assign: boolean) => void;
  onMenteeSelectionToggle: (menteeId: string) => void;
}

const TodoMenteeAssignment = ({
  mentees,
  assignToMentees,
  selectedMentees,
  onAssignToMenteesChange,
  onMenteeSelectionToggle
}: TodoMenteeAssignmentProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="assign-to-mentees"
          checked={assignToMentees}
          onCheckedChange={(checked) => onAssignToMenteesChange(checked as boolean)}
        />
        <label htmlFor="assign-to-mentees" className="text-sm font-medium">
          Assign to mentees
        </label>
      </div>

      {assignToMentees && (
        <div className="space-y-2 p-4 border rounded-md bg-gray-50">
          <p className="text-sm font-medium">Select mentees to assign this todo:</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {mentees.map((mentee) => (
              <div key={mentee.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`mentee-${mentee.id}`}
                  checked={selectedMentees.includes(mentee.id)}
                  onCheckedChange={() => onMenteeSelectionToggle(mentee.id)}
                />
                <label htmlFor={`mentee-${mentee.id}`} className="text-sm">
                  {mentee.first_name} {mentee.last_name}
                </label>
              </div>
            ))}
          </div>
          {selectedMentees.length > 0 && (
            <p className="text-xs text-gray-600">
              {selectedMentees.length} mentee(s) selected
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoMenteeAssignment;
