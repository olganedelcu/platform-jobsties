
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2 } from 'lucide-react';

interface TimeSlotSelectionProps {
  selectedDate: Date | null;
  availableTimesForDate: string[];
  selectedTime: string;
  loadingTimes: boolean;
  onTimeSelect: (time: string) => void;
  onConfirmBooking: () => void;
}

const TimeSlotSelection = ({ 
  selectedDate, 
  availableTimesForDate, 
  selectedTime, 
  loadingTimes, 
  onTimeSelect, 
  onConfirmBooking 
}: TimeSlotSelectionProps) => {
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  };

  if (!selectedDate) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">
          {formatSelectedDate(selectedDate)}
        </h4>
        <Badge variant="secondary" className="text-xs">
          Available times from Cal.com
        </Badge>
      </div>
      
      {loadingTimes ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mr-2" />
          <span>Loading available times...</span>
        </div>
      ) : availableTimesForDate.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No available times for this date</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {availableTimesForDate.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={`py-3 justify-start ${
                selectedTime === time 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-gray-300 hover:border-green-500'
              }`}
              onClick={() => onTimeSelect(time)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{time}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {selectedTime && (
        <div className="pt-4 space-y-3">
          <Button
            onClick={onConfirmBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            Confirm Booking
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelection;
