
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 space-y-6 sm:space-y-0">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Coaching Sessions</h1>
        <p className="text-gray-600 mt-3">Schedule and manage your coaching sessions</p>
      </div>
      
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full sm:w-auto px-6 py-3">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white w-full mx-4 sm:mx-auto">
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
