
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  currentMonth: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

const CalendarView = ({ currentMonth, selectedDate, onDateSelect, onNavigateMonth }: CalendarViewProps) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const days = getDaysInMonth(currentMonth);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {formatMonth(currentMonth)}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateMonth('prev')}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateMonth('next')}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <Button
                variant={isSelected(date) ? "default" : "ghost"}
                className={`w-full h-full text-sm ${
                  isPastDate(date) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-100'
                } ${
                  isToday(date) ? 'ring-2 ring-blue-500' : ''
                } ${
                  isSelected(date) ? 'bg-blue-600 text-white' : ''
                }`}
                onClick={() => onDateSelect(date)}
                disabled={isPastDate(date)}
              >
                {date.getDate()}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
