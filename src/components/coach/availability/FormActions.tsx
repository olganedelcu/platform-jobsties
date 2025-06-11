
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onClear: () => void;
  isSubmitting: boolean;
}

const FormActions = ({ onClear, isSubmitting }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onClear}
      >
        Clear
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Availability'}
      </Button>
    </div>
  );
};

export default FormActions;
