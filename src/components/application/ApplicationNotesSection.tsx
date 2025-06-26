
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { JobApplication } from '@/types/jobApplications';

interface ApplicationNotesSectionProps {
  application: JobApplication;
  isEditing: boolean;
  editData: Partial<JobApplication>;
  onEditDataChange: (updates: Partial<JobApplication>) => void;
}

const ApplicationNotesSection = ({
  application,
  isEditing,
  editData,
  onEditDataChange
}: ApplicationNotesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editData.mentee_notes || ''}
            onChange={(e) => onEditDataChange({ mentee_notes: e.target.value })}
            className="min-h-[120px] bg-green-50 border-green-200 focus:border-green-400"
            placeholder="Add your notes about this application..."
          />
        ) : (
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 min-h-[120px]">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {application.mentee_notes || 'No notes added yet.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationNotesSection;
