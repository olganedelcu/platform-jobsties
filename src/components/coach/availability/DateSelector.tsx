
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate: string;
}

const DateSelector = ({ selectedDate, onDateChange, minDate }: DateSelectorProps) => {
  return (
    <div>
      <Label htmlFor="date" className="flex items-center space-x-2">
        <Calendar className="h-4 w-4" />
        <span>Date</span>
      </Label>
      <Input
        id="date"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        min={minDate}
        className="mt-1"
      />
    </div>
  );
};

export default DateSelector;
