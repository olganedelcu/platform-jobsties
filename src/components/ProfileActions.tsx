
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';

interface ProfileActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileActions = ({
  isEditing,
  onEdit,
  onSave,
  onCancel
}: ProfileActionsProps) => {
  return (
    <div className="flex space-x-2 mt-6">
      {isEditing ? (
        <>
          <Button 
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button 
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;
