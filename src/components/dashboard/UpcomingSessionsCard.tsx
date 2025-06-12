
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video } from 'lucide-react';

const UpcomingSessionsCard = () => {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <p className="text-sm text-gray-600">Your scheduled coaching sessions</p>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Video className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h4>
          <p className="text-gray-600 mb-6">Schedule a session with your coach to get personalized guidance</p>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsCard;
