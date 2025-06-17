
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

  // Get Ana's actual coach ID from the database
  useEffect(() => {
    const fetchAnaCoachId = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', 'ana@jobsties.com')
          .eq('role', 'coach')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching Ana coach ID:', error);
        } else if (data) {
          setAnaCoachId(data.id);
        } else {
          console.log('Ana coach profile not found, using fallback availability');
          // Set a fallback value or handle gracefully
          setAnaCoachId('fallback');
        }
      } catch (error) {
        console.error('Error fetching Ana coach ID:', error);
        setAnaCoachId('fallback');
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
    if (selectedDate && anaCoachId) {
      loadAvailableTimesForSelectedDate();
    }
  }, [selectedDate, anaCoachId]);

  const loadAvailableTimesForSelectedDate = async () => {
    if (!selectedDate || !anaCoachId) return;
    
    setLoadingTimes(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
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
    if (isPastDate(date) || !anaCoachId) return;
    
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

  // Show loading state while availability is being fetched or Ana's ID is being loaded
  if (loading || !anaCoachId) {
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
      <SessionTypeSelection
        sessionTypes={sessionTypes}
        onSelectSessionType={setSelectedSessionType}
        onCancel={onCancel}
      />
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
