import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';
import { useCoachAvailability } from '@/hooks/useCoachAvailability';
import SessionTypeSelection from './SessionTypeSelection';
import CoachInfoPanel from './CoachInfoPanel';
import CalendarView from './CalendarView';
import TimeSlotSelection from './TimeSlotSelection';
import { supabase } from '@/integrations/supabase/client';

interface CalComStyleBookingProps {
  onBookSession: (sessionData: any) => void;
  onCancel: () => void;
}

const CalComStyleBooking = ({ onBookSession, onCancel }: CalComStyleBookingProps) => {
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableTimesForDate, setAvailableTimesForDate] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [anaCoachId, setAnaCoachId] = useState<string | null>(null);
  const [coachIdLoading, setCoachIdLoading] = useState(true);

  // Get Ana's actual coach ID from the database
  useEffect(() => {
    const fetchAnaCoachId = async () => {
      try {
        console.log('Fetching Ana coach ID...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', 'ana@jobsties.com')
          .eq('role', 'COACH')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching Ana coach ID:', error);
          setAnaCoachId(null);
        } else if (data) {
          console.log('Found Ana coach ID:', data.id);
          setAnaCoachId(data.id);
        } else {
          console.log('Ana coach profile not found, will use default availability');
          setAnaCoachId(null);
        }
      } catch (error) {
        console.error('Error fetching Ana coach ID:', error);
        setAnaCoachId(null);
      } finally {
        setCoachIdLoading(false);
      }
    };

    fetchAnaCoachId();
  }, []);

  const { isDateAvailable, getAvailableTimesForDate, loading } = useCoachAvailability(anaCoachId);

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

  useEffect(() => {
    if (selectedDate && !coachIdLoading) {
      loadAvailableTimesForSelectedDate();
    }
  }, [selectedDate, anaCoachId, coachIdLoading]);

  const loadAvailableTimesForSelectedDate = async () => {
    if (!selectedDate) return;
    
    setLoadingTimes(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      console.log('Loading available times for date:', dateString, 'with coach ID:', anaCoachId);
      const times = await getAvailableTimesForDate(dateString);
      setAvailableTimesForDate(times);
    } catch (error) {
      console.error('Error loading available times:', error);
      setAvailableTimesForDate([]);
    } finally {
      setLoadingTimes(false);
    }
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

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = async (date: Date) => {
    if (isPastDate(date)) return;
    
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableTimesForDate([]);
    
    // Check if date is available
    const dateString = date.toISOString().split('T')[0];
    const available = await isDateAvailable(dateString);
    
    if (!available) {
      setAvailableTimesForDate([]);
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

  // Show loading state while coach ID and availability are being fetched
  if (loading || coachIdLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
          <span>Loading availability...</span>
        </div>
      </div>
    );
  }

  // Show session type selection first
  if (!selectedSessionType) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
        {/* Session Type */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Session Type</h2>
          <p className="text-gray-600 mb-8">Select the type of coaching session you'd like to book</p>
          
          <div className="max-w-md">
            {sessionTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-blue-300 rounded-lg p-6"
                  onClick={() => setSelectedSessionType(type.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 ${type.color} text-white rounded-xl`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <span className="text-sm">{type.duration} min</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{type.description}</p>
                    </div>
                  </div>
                </div>
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
      <CoachInfoPanel
        selectedSessionType={selectedSessionType}
        sessionTypes={sessionTypes}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />

      {/* Right Panel - Calendar */}
      <div className="lg:w-2/3 p-8">
        <CalendarView
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onNavigateMonth={navigateMonth}
        />

        <TimeSlotSelection
          selectedDate={selectedDate}
          availableTimesForDate={availableTimesForDate}
          selectedTime={selectedTime}
          loadingTimes={loadingTimes}
          onTimeSelect={handleTimeSelect}
          onConfirmBooking={handleBooking}
        />

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
