
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const CalendarSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Manual calendar management is active. You can add availability slots 
            manually using the "Add Availability" button above.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium">Manual Calendar Mode</h3>
            <p className="text-sm text-gray-600">
              Create and manage your availability slots directly in the application.
              This gives you full control over your schedule without external calendar dependencies.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSettings;
