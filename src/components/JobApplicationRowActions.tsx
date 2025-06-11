
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';

interface JobApplicationRowActionsProps {
  application: JobApplication;
  isEditing: boolean;
  isAddingNew: boolean;
  isCoachView: boolean;
  onEdit: (application: JobApplication) => void;
  onSave: (applicationId: string) => Promise<void>;
  onCancel: () => void;
  onDelete: (applicationId: string) => Promise<void>;
}

const JobApplicationRowActions = ({
  application,
  isEditing,
  isAddingNew,
  isCoachView,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: JobApplicationRowActionsProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-1">
        <Button size="sm" onClick={() => onSave(application.id)}>
          <Save className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(application)}
        disabled={isAddingNew}
      >
        <Edit className="h-3 w-3" />
      </Button>
      {!isCoachView && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(application.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default JobApplicationRowActions;
