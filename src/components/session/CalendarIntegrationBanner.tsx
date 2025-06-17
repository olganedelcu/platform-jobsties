
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const CalendarIntegrationBanner = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg text-white flex-shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-blue-900">Smart Scheduling</h3>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Automated
              </Badge>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              Your session will be automatically added to both your calendar and Ana's calendar. 
              You'll receive a confirmation email with the meeting details and video call link.
            </p>
            <div className="flex items-center space-x-2 mt-3 text-xs text-blue-600">
              <Clock className="h-3 w-3" />
              <span>Instant confirmation • Calendar sync • Video call setup</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegrationBanner;
