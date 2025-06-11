
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play } from 'lucide-react';

const UpcomingSessionsCard = () => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-900 text-lg">Coming up</span>
        </div>
        <div className="text-sm text-gray-600 mb-2">Feature in development</div>
        <div className="text-sm font-semibold text-blue-600 mb-4">Stay tuned!</div>
        <div className="flex justify-end">
          <Button size="sm" className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl" disabled>
            <Play className="w-4 h-4 fill-current" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsCard;
