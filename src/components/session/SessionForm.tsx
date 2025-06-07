
import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video } from 'lucide-react';
import { useCoachAvailability } from '@/hooks/useCoachAvailability';
import AvailabilityIndicator from './AvailabilityIndicator';

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
  // For now, we'll use Ana's ID - in a real app, this would come from the coach selection
  const anaCoachId = 'ana-coach-id'; // This should be Ana's actual user ID from profiles table
  
  const {
    availability,
    blockedDates,
    loading: availabilityLoading,
    isDateAvailable,
    getAvailableTimesForDate
  } = useCoachAvailability(anaCoachId);

  const availableTimesForSelectedDate = useMemo(() => {
    if (sessionData.date) {
      return getAvailableTimesForDate(sessionData.date);
    }
    return [];
  }, [sessionData.date, getAvailableTimesForDate]);

  const isSelectedDateAvailable = useMemo(() => {
    if (sessionData.date) {
      return isDateAvailable(sessionData.date);
    }
    return false;
  }, [sessionData.date, isDateAvailable]);

  // Filter time slots to only show available times
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

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="preferredCoach">Coach</Label>
        <Select 
          value={sessionData.preferredCoach} 
          onValueChange={(value) => updateSessionData('preferredCoach', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="Ana Nedelcu">Ana Nedelcu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={sessionData.date}
            onChange={(e) => updateSessionData('date', e.target.value)}
            className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
            min={minDate}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Select 
            value={sessionData.time} 
            onValueChange={(value) => updateSessionData('time', value)}
            disabled={!sessionData.date || !isSelectedDateAvailable}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !sessionData.date ? "Select date first" :
                !isSelectedDateAvailable ? "Date not available" :
                "Select time"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select value={sessionData.duration} onValueChange={(value) => updateSessionData('duration', value)}>
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

      {/* Availability Indicator */}
      {!availabilityLoading && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <AvailabilityIndicator
            isAvailable={isSelectedDateAvailable}
            availableTimes={availableTimesForSelectedDate}
            selectedDate={sessionData.date}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any specific topics you'd like to discuss or preparation you've done..."
          value={sessionData.notes}
          onChange={(e) => updateSessionData('notes', e.target.value)}
          className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
        <Video className="h-5 w-5 text-blue-600" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Session will be conducted via video call</p>
          <p>You'll receive a meeting link once your session is confirmed</p>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          disabled={!sessionData.sessionType || !sessionData.date || !sessionData.time || !isSelectedDateAvailable}
        >
          Schedule Session
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;
