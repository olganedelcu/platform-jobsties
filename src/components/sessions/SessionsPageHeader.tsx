
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar } from 'lucide-react';
import ScheduleSession from '@/components/ScheduleSession';

interface SessionsPageHeaderProps {
  showScheduleDialog: boolean;
  setShowScheduleDialog: (show: boolean) => void;
  onScheduleSession: (sessionData: any) => void;
  userId?: string;
  sessionRefreshKey: number;
}

const SessionsPageHeader = ({
  showScheduleDialog,
  setShowScheduleDialog,
  onScheduleSession,
  userId,
  sessionRefreshKey
}: SessionsPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
      <div>
        <Calendar className="h-8 w-8 text-blue-600" />
      </div>
      
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto p-0">
          <ScheduleSession 
            key={sessionRefreshKey}
            onSchedule={onScheduleSession}
            onCancel={() => {
              console.log('Cancelling session scheduling');
              setShowScheduleDialog(false);
            }}
            userId={userId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionsPageHeader;
