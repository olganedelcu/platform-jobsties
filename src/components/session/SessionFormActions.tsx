
import React from 'react';
import { Button } from '@/components/ui/button';

interface SessionFormActionsProps {
  isFormValid: boolean;
  onCancel: () => void;
}

const SessionFormActions = ({ isFormValid, onCancel }: SessionFormActionsProps) => {
  console.log('SessionFormActions - isFormValid:', isFormValid);
  
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        disabled={!isFormValid}
      >
        {isFormValid ? 'Schedule Session' : 'Please complete all fields'}
      </Button>
    </div>
  );
};

export default SessionFormActions;
