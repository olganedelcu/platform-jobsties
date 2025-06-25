
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Save, X, Eye } from 'lucide-react';

interface JobApplicationRowActionsProps {
  isEditing: boolean;
  isAddingNew: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  jobLink?: string | null;
  applicationId?: string;
}

const JobApplicationRowActions = ({
  isEditing,
  isAddingNew,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  applicationId
}: JobApplicationRowActionsProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (applicationId) {
      navigate(`/application/${applicationId}`);
    }
  };

  return (
    <div className="flex gap-1">
      {isEditing ? (
        <>
          <Button 
            size="sm" 
            onClick={onSave}
            className="px-2 h-7"
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onCancel}
            className="px-2 h-7"
          >
            <X className="h-3 w-3" />
          </Button>
        </>
      ) : (
        <>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleViewDetails}
            disabled={isAddingNew}
            className="p-1 h-7 w-7"
            title="View details"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onEdit}
            disabled={isAddingNew}
            className="p-1 h-7 w-7"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onDelete}
            disabled={isAddingNew}
            className="p-1 h-7 w-7"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </>
      )}
    </div>
  );
};

export default JobApplicationRowActions;
