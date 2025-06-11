
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';

interface MenteeNotesCellProps {
  menteeId: string;
  initialNote: string;
  onSave: (menteeId: string, note: string) => void;
}

const MenteeNotesCell = ({ menteeId, initialNote, onSave }: MenteeNotesCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote);

  const handleSave = () => {
    onSave(menteeId, note);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNote(initialNote);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add notes about this mentee..."
          className="min-h-[80px] text-sm"
        />
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="h-8"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="min-h-[40px] text-sm text-gray-700 whitespace-pre-wrap">
        {note || (
          <span className="text-gray-400 italic">Click to add notes...</span>
        )}
      </div>
      <Button
        onClick={() => setIsEditing(true)}
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default MenteeNotesCell;
