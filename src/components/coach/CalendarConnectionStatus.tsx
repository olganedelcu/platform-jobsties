
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarConnectionStatus = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="font-medium">Manual Calendar Management</p>
              <p className="text-sm text-gray-600">
                Add availability slots manually to manage your schedule
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="default">
              Manual Mode
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarConnectionStatus;
