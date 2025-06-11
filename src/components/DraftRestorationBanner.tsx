
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface DraftRestorationBannerProps {
  lastUpdated: string;
  onDismiss: () => void;
  onDiscard: () => void;
}

const DraftRestorationBanner = ({ lastUpdated, onDismiss, onDiscard }: DraftRestorationBannerProps) => {
  const formattedDate = format(new Date(lastUpdated), 'MMM dd, yyyy at h:mm a');

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <RotateCcw className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800">
          Restored unsaved changes from {formattedDate}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onDiscard}
            className="text-xs h-7 px-2"
          >
            Reset Form
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DraftRestorationBanner;
