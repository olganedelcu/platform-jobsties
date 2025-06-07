
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AvailabilityIndicatorProps {
  isAvailable: boolean;
  availableTimes?: string[];
  selectedDate?: string;
}

const AvailabilityIndicator = ({ isAvailable, availableTimes = [], selectedDate }: AvailabilityIndicatorProps) => {
  if (!selectedDate) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        <span>Select a date to see availability</span>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="flex items-center space-x-2">
        <XCircle className="h-4 w-4 text-red-500" />
        <Badge variant="destructive">Not Available</Badge>
        <span className="text-sm text-gray-500">
          Ana is not available on this date
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <Badge variant="default" className="bg-green-100 text-green-800">
          Available
        </Badge>
        <span className="text-sm text-gray-600">
          {availableTimes.length} time slots available
        </span>
      </div>
      
      {availableTimes.length > 0 && (
        <div className="text-xs text-gray-500">
          Available times: {availableTimes.slice(0, 3).join(', ')}
          {availableTimes.length > 3 && ` and ${availableTimes.length - 3} more`}
        </div>
      )}
    </div>
  );
};

export default AvailabilityIndicator;
