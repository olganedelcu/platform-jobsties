
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isVisible: boolean;
}

const AutoSaveIndicator = ({ isVisible }: AutoSaveIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 border-green-200">
      <CheckCircle2 className="h-3 w-3 mr-1" />
      Auto-saved
    </Badge>
  );
};

export default AutoSaveIndicator;
