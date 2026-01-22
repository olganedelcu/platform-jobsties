
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface DayAvailabilityRowProps {
  day: string;
  slot: AvailabilitySlot;
  onUpdate: (field: string, value: boolean | string) => void;
}

const DayAvailabilityRow = ({ day, slot, onUpdate }: DayAvailabilityRowProps) => {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <div className="w-24">
        <span className="font-medium">{day}</span>
      </div>
      
      <Switch
        checked={slot.is_available}
        onCheckedChange={(checked) => onUpdate('is_available', checked)}
      />
      
      {slot.is_available && (
        <>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <Input
              type="time"
              value={slot.start_time}
              onChange={(e) => onUpdate('start_time', e.target.value)}
              className="w-24"
            />
            <span>to</span>
            <Input
              type="time"
              value={slot.end_time}
              onChange={(e) => onUpdate('end_time', e.target.value)}
              className="w-24"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DayAvailabilityRow;
