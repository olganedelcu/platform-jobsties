
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Clock } from 'lucide-react';
import TimeSlotInput from './TimeSlotInput';

interface TimeSlot {
  start: string;
  end: string;
}

interface TimeSlotsSectionProps {
  timeSlots: TimeSlot[];
  onAddTimeSlot: () => void;
  onUpdateTimeSlot: (index: number, field: keyof TimeSlot, value: string) => void;
  onRemoveTimeSlot: (index: number) => void;
}

const TimeSlotsSection = ({ 
  timeSlots, 
  onAddTimeSlot, 
  onUpdateTimeSlot, 
  onRemoveTimeSlot 
}: TimeSlotsSectionProps) => {
  return (
    <div className="space-y-3">
      <Label className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span>Available Time Slots</span>
      </Label>
      
      {timeSlots.map((slot, index) => (
        <TimeSlotInput
          key={index}
          slot={slot}
          index={index}
          onUpdate={onUpdateTimeSlot}
          onRemove={onRemoveTimeSlot}
          canRemove={timeSlots.length > 1}
        />
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddTimeSlot}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Time Slot
      </Button>
    </div>
  );
};

export default TimeSlotsSection;
