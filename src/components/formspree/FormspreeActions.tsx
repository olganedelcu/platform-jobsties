
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, TestTube } from 'lucide-react';

interface FormspreeActionsProps {
  onUpdate: () => void;
  onTest: () => void;
  onReset: () => void;
  isTesting: boolean;
}

const FormspreeActions = ({ onUpdate, onTest, onReset, isTesting }: FormspreeActionsProps) => {
  return (
    <div className="flex gap-3">
      <Button onClick={onUpdate} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        Update Configuration
      </Button>
      
      <Button 
        onClick={onTest} 
        variant="outline"
        disabled={isTesting}
        className="flex items-center gap-2"
      >
        <TestTube className="h-4 w-4" />
        {isTesting ? 'Sending Test...' : 'Send Test Email'}
      </Button>

      <Button onClick={onReset} variant="destructive">
        Reset
      </Button>
    </div>
  );
};

export default FormspreeActions;
