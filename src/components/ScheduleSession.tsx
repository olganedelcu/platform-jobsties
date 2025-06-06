
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import SessionTypeSelector from '@/components/session/SessionTypeSelector';
import SessionForm from '@/components/session/SessionForm';
import CalendarIntegrationBanner from '@/components/session/CalendarIntegrationBanner';

interface ScheduleSessionProps {
  onSchedule: (sessionData: any) => void;
  onCancel: () => void;
  userId?: string;
}

const ScheduleSession = ({ onSchedule, onCancel, userId }: ScheduleSessionProps) => {
  const [sessionData, setSessionData] = useState({
    sessionType: '',
    date: '',
    time: '',
    duration: '60',
    notes: '',
    preferredCoach: 'Ana Nedelcu'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(sessionData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <span>Schedule a Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Google Calendar Integration Section */}
          <CalendarIntegrationBanner />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SessionTypeSelector
              value={sessionData.sessionType}
              onChange={(value) => setSessionData({...sessionData, sessionType: value})}
            />
          </div>

          {/* Show form for all session types */}
          {sessionData.sessionType && (
            <SessionForm
              sessionData={sessionData}
              onSessionDataChange={setSessionData}
              onSubmit={handleSubmit}
              onCancel={onCancel}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSession;
