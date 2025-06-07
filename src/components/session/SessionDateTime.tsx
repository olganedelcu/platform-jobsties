
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SessionDateTimeProps {
  date: string;
  time: string;
  duration: string;
  isDateAvailable: boolean;
  timeSlots: string[];
  minDate: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onDurationChange: (duration: string) => void;
}

const SessionDateTime = ({
  date,
  time,
  duration,
  isDateAvailable,
  timeSlots,
  minDate,
  onDateChange,
  onTimeChange,
  onDurationChange
}: SessionDateTimeProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          min={minDate}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Select 
          value={time} 
          onValueChange={onTimeChange}
          disabled={!date || !isDateAvailable}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !date ? "Select date first" :
              !isDateAvailable ? "Date not available" :
              "Select time"
            } />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
            {timeSlots.map((timeSlot) => (
              <SelectItem key={timeSlot} value={timeSlot}>{timeSlot}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
            <SelectItem value="90">90 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SessionDateTime;
