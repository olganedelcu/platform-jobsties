
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Video, Globe } from 'lucide-react';

interface SessionType {
  id: string;
  name: string;
  duration: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface CoachInfoPanelProps {
  selectedSessionType: string;
  sessionTypes: SessionType[];
  selectedDate: Date | null;
  selectedTime: string;
}

const CoachInfoPanel = ({ selectedSessionType, sessionTypes, selectedDate, selectedTime }: CoachInfoPanelProps) => {
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="lg:w-1/3 bg-gray-900 text-white p-8">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/assets/coach-avatar.png" alt="Ana Nedelcu" />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">Ana Nedelcu</h2>
          <p className="text-gray-300">Career Coach</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">
            {sessionTypes.find(t => t.id === selectedSessionType)?.name}
          </h3>
          <div className="flex items-center space-x-2 text-gray-300 mb-2">
            <Clock className="h-4 w-4" />
            <span>{sessionTypes.find(t => t.id === selectedSessionType)?.duration}m</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 mb-2">
            <Video className="h-4 w-4" />
            <span>Google Meet</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <Globe className="h-4 w-4" />
            <span>Europe/Riga</span>
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="bg-blue-600 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Selected Time</h4>
            <p className="text-sm">{formatSelectedDate(selectedDate)}</p>
            <p className="text-sm">{selectedTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachInfoPanel;
