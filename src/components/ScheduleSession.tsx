
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import CalComStyleBooking from '@/components/session/CalComStyleBooking';

interface ScheduleSessionProps {
  onSchedule: (sessionData: any) => void;
  onCancel: () => void;
  userId?: string;
}

const ScheduleSession = ({ onSchedule, onCancel, userId }: ScheduleSessionProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <CalComStyleBooking
        onBookSession={onSchedule}
        onCancel={onCancel}
      />
    </div>
  );
};

export default ScheduleSession;
