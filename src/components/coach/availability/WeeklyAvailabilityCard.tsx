
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Save } from 'lucide-react';
import DayAvailabilityRow from './DayAvailabilityRow';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface WeeklyAvailabilityCardProps {
  availability: AvailabilitySlot[];
  onUpdateAvailability: (dayIndex: number, field: string, value: any) => void;
  onSave: () => void;
  saving: boolean;
}

const WeeklyAvailabilityCard = ({ 
  availability, 
  onUpdateAvailability, 
  onSave, 
  saving 
}: WeeklyAvailabilityCardProps) => {
  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Weekly Availability</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availability.map((slot, index) => (
          <DayAvailabilityRow
            key={index}
            day={daysOfWeek[index]}
            slot={slot}
            onUpdate={(field, value) => onUpdateAvailability(index, field, value)}
          />
        ))}
        
        <Button 
          onClick={onSave} 
          disabled={saving}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Availability'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeeklyAvailabilityCard;
