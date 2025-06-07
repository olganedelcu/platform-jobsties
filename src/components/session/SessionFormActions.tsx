
import React from 'react';
import { Button } from '@/components/ui/button';

interface SessionFormActionsProps {
  isFormValid: boolean;
  onCancel: () => void;
}

const SessionFormActions = ({ isFormValid, onCancel }: SessionFormActionsProps) => {
  return (
    <div className="flex space-x-4 pt-4">
      <Button
        type="submit"
        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        disabled={!isFormValid}
      >
        Schedule Session
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </Button>
    </div>
  );
};

export default SessionFormActions;
