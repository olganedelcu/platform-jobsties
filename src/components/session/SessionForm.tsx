
import React, { useEffect, useMemo, useState } from 'react';
import { useCoachAvailability } from '@/hooks/useCoachAvailability';
import AvailabilityIndicator from './AvailabilityIndicator';
import SessionBasicDetails from './SessionBasicDetails';
import SessionDateTime from './SessionDateTime';
import SessionNotes from './SessionNotes';
import SessionMeetingInfo from './SessionMeetingInfo';
import SessionFormActions from './SessionFormActions';

interface SessionFormData {
  sessionType: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  preferredCoach: string;
}

interface SessionFormProps {
  sessionData: SessionFormData;
  onSessionDataChange: (data: SessionFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const SessionForm = ({ sessionData, onSessionDataChange, onSubmit, onCancel }: SessionFormProps) => {
  const [availableTimesForSelectedDate, setAvailableTimesForSelectedDate] = useState<string[]>([]);
  const [isSelectedDateAvailable, setIsSelectedDateAvailable] = useState<boolean>(false);
  
  // Use the availability hook without a specific coach ID to get default Ana availability
  const {
    availability,
    blockedDates,
    loading: availabilityLoading,
    isDateAvailable,
    getAvailableTimesForDate
  } = useCoachAvailability();

  // Load availability for selected date
  useEffect(() => {
    const loadAvailability = async () => {
      if (sessionData.date) {
        const [dateAvailable, availableTimes] = await Promise.all([
          isDateAvailable(sessionData.date),
          getAvailableTimesForDate(sessionData.date)
        ]);
        
        setIsSelectedDateAvailable(dateAvailable);
        setAvailableTimesForSelectedDate(availableTimes);
      } else {
        setIsSelectedDateAvailable(false);
        setAvailableTimesForSelectedDate([]);
      }
    };

    loadAvailability();
  }, [sessionData.date, isDateAvailable, getAvailableTimesForDate]);

  // Filter time slots to only show available times (already filtered for booked sessions)
  const timeSlots = useMemo(() => {
    if (availableTimesForSelectedDate.length > 0) {
      return availableTimesForSelectedDate;
    }
    
    // Fallback to default time slots if no availability data
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
  }, [availableTimesForSelectedDate]);

  const updateSessionData = (field: keyof SessionFormData, value: string) => {
    onSessionDataChange({
      ...sessionData,
      [field]: value
    });
  };

  // Clear time selection when date changes and it's not available
  useEffect(() => {
    if (sessionData.date && !isSelectedDateAvailable && sessionData.time) {
      updateSessionData('time', '');
    }
  }, [sessionData.date, isSelectedDateAvailable]);

  // Clear time selection if the currently selected time is no longer available
  useEffect(() => {
    if (sessionData.time && sessionData.date && !timeSlots.includes(sessionData.time)) {
      console.log('Selected time is no longer available, clearing selection');
      updateSessionData('time', '');
    }
  }, [sessionData.time, sessionData.date, timeSlots]);

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  const isFormValid = !(!sessionData.sessionType || !sessionData.date || !sessionData.time || !isSelectedDateAvailable);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SessionBasicDetails
        preferredCoach={sessionData.preferredCoach}
        onCoachChange={(value) => updateSessionData('preferredCoach', value)}
      />

      <SessionDateTime
        date={sessionData.date}
        time={sessionData.time}
        duration={sessionData.duration}
        isDateAvailable={isSelectedDateAvailable}
        timeSlots={timeSlots}
        minDate={minDate}
        onDateChange={(value) => updateSessionData('date', value)}
        onTimeChange={(value) => updateSessionData('time', value)}
        onDurationChange={(value) => updateSessionData('duration', value)}
      />

      {/* Availability Indicator */}
      {!availabilityLoading && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <AvailabilityIndicator
            isAvailable={isSelectedDateAvailable}
            availableTimes={availableTimesForSelectedDate}
            selectedDate={sessionData.date}
          />
          {sessionData.date && availableTimesForSelectedDate.length === 0 && (
            <div className="mt-2 text-sm text-orange-600">
              All time slots for this date are already booked by other mentees.
            </div>
          )}
        </div>
      )}

      <SessionNotes
        notes={sessionData.notes}
        onNotesChange={(value) => updateSessionData('notes', value)}
      />

      <SessionMeetingInfo />

      <SessionFormActions
        isFormValid={isFormValid}
        onCancel={onCancel}
      />
    </form>
  );
};

export default SessionForm;
