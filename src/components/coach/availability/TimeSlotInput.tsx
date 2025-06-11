
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface TimeSlotInputProps {
  slot: TimeSlot;
  index: number;
  onUpdate: (index: number, field: keyof TimeSlot, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const TimeSlotInput = ({ slot, index, onUpdate, onRemove, canRemove }: TimeSlotInputProps) => {
  return (
    <div className="flex items-center space-x-2 p-3 border rounded-lg">
      <div className="flex items-center space-x-2 flex-1">
        <Input
          type="time"
          value={slot.start}
          onChange={(e) => onUpdate(index, 'start', e.target.value)}
          className="w-32"
        />
        <span className="text-gray-500">to</span>
        <Input
          type="time"
          value={slot.end}
          onChange={(e) => onUpdate(index, 'end', e.target.value)}
          className="w-32"
        />
        <Badge variant="outline" className="ml-2">
          {slot.start} - {slot.end}
        </Badge>
      </div>
      
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TimeSlotInput;
