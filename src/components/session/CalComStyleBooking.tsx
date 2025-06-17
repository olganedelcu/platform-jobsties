
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Video, Globe, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CalComStyleBookingProps {
  onBookSession: (sessionData: any) => void;
  onCancel: () => void;
}

const CalComStyleBooking = ({ onBookSession, onCancel }: CalComStyleBookingProps) => {
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const sessionTypes = [
    {
      id: '1on1',
      name: '1-on-1 Session',
      duration: 30,
      description: 'Personalized career coaching session',
      icon: Users,
      color: 'bg-blue-500'
    }
  ];

  const availableTimeSlots = ['15:30', '18:30', '19:00'];

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
    return selectedDate && date.toDateString() === selectedDate.toDateString();
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
      setSelectedTime('');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedSessionType) {
      const selectedType = sessionTypes.find(type => type.id === selectedSessionType);
      const sessionData = {
        sessionType: selectedType?.name || '1-on-1 Session',
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: selectedType?.duration.toString() || '30',
        notes: '',
        preferredCoach: 'Ana Nedelcu'
      };
      onBookSession(sessionData);
    }
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const days = getDaysInMonth(currentMonth);

  // Show session type selection first
  if (!selectedSessionType) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Schedule Your Session</h1>
              <p className="text-blue-100 mt-2">Book a personalized coaching session with Ana Nedelcu</p>
            </div>
          </div>
        </div>

        {/* Smart Scheduling Banner */}
        <div className="p-8 bg-gray-50 border-b">
          <div className="flex items-start space-x-4 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-blue-900">Smart Scheduling</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">Automated</Badge>
              </div>
              <p className="text-blue-700 mb-3">
                Your session will be automatically added to both your calendar and Ana's calendar. You'll
                receive a confirmation email with the meeting details and video call link.
              </p>
              <div className="flex items-center space-x-4 text-sm text-blue-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Instant confirmation</span>
                </div>
                <span>•</span>
                <span>Calendar sync</span>
                <span>•</span>
                <span>Video call setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Type */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Session Type</h2>
          <p className="text-gray-600 mb-8">Select the type of coaching session you'd like to book</p>
          
          <div className="max-w-md">
            {sessionTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={type.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-blue-300"
                  onClick={() => setSelectedSessionType(type.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${type.color} text-white rounded-xl`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{type.duration} min</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="p-8 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Show calendar interface
  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Left Panel - Coach Info */}
      <div className="lg:w-1/3 bg-gray-900 text-white p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/lovable-uploads/a7c80f69-dda0-4640-8fd9-638d97a91768.png" alt="Ana Nedelcu" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">Ana Nedelcu</h2>
            <p className="text-gray-300">Career Coach</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              {sessionTypes.find(t => t.id === selectedSessionType)?.name}
            </h3>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <Clock className="h-4 w-4" />
              <span>{sessionTypes.find(t => t.id === selectedSessionType)?.duration}m</span>
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
            
            <div className="grid grid-cols-1 gap-3">
              {availableTimeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`py-3 justify-start ${
                    selectedTime === time 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{time}</span>
                  </div>
                </Button>
              ))}
            </div>

            {selectedTime && (
              <div className="pt-4 space-y-3">
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

        <div className="mt-6 flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setSelectedSessionType('')}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Session Types
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalComStyleBooking;
