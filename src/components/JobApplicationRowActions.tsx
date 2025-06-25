
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Save, X, ExternalLink } from 'lucide-react';

interface JobApplicationRowActionsProps {
  isEditing: boolean;
  isAddingNew: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  jobLink?: string | null;
}

const JobApplicationRowActions = ({
  isEditing,
  isAddingNew,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  jobLink
}: JobApplicationRowActionsProps) => {
  const handleViewJob = () => {
    if (!jobLink) return;
    
    let url = jobLink.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Silent fail for security
    }
  };

  return (
    <div className="flex gap-1">
      {jobLink && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleViewJob}
          title="View job posting"
          className="p-1 h-7 w-7"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
      
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
