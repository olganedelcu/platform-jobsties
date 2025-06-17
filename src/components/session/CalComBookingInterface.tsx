
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CalComBookingInterfaceProps {
  onBookSession: (sessionData: any) => void;
  onBack: () => void;
}

const CalComBookingInterface = ({ onBookSession, onBack }: CalComBookingInterfaceProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock available time slots for the selected date
  const availableTimeSlots = ['13:30', '15:30', '18:30', '19:00'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (date: Date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
      setSelectedTime(''); // Reset selected time when date changes
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      const sessionData = {
        sessionType: 'General Coaching',
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: '30',
        notes: '',
        preferredCoach: 'Ana Nedelcu'
      };
      onBookSession(sessionData);
    }
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const days = getDaysInMonth(currentMonth);

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Left Panel - Coach Info */}
      <div className="lg:w-1/3 bg-gray-900 text-white p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/lovable-uploads/09eb05af-ad26-4901-aafd-0d84888e4010.png" alt="Ana Nedelcu" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">Ana Nedelcu</h2>
            <p className="text-gray-300">Career Coach</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">30 Min Meeting</h3>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <Clock className="h-4 w-4" />
              <span>30m</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <Video className="h-4 w-4" />
              <span>Google Meet</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Globe className="h-4 w-4" />
              <span>Europe/Riga</span>
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="bg-blue-600 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Selected Time</h4>
              <p className="text-sm">{formatSelectedDate(selectedDate)}</p>
              <p className="text-sm">{selectedTime}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Calendar */}
      <div className="lg:w-2/3 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {formatMonth(currentMonth)}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
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
                  onClick={() => handleDateSelect(date)}
                  disabled={isPastDate(date)}
                >
                  {date.getDate()}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {formatSelectedDate(selectedDate)}
              </h4>
              <Badge variant="secondary" className="text-xs">
                12h • 24h
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {availableTimeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`py-3 ${
                    selectedTime === time 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{time}</span>
                  </div>
                </Button>
              ))}
            </div>

            {selectedTime && (
              <div className="pt-4">
                <Button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  Confirm Booking
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Session Types
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalComBookingInterface;
