
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  start: string;
  end: string;
}

export const useManualAvailabilityForm = (onAvailabilityAdded: () => void) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ start: '09:00', end: '10:00' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: '09:00', end: '10:00' }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = timeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    setTimeSlots(updatedSlots);
  };

  const validateTimeSlots = () => {
    for (const slot of timeSlots) {
      if (slot.start >= slot.end) {
        toast({
          title: "Invalid Time",
          description: "End time must be after start time",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const clearForm = () => {
    setSelectedDate('');
    setTimeSlots([{ start: '09:00', end: '10:00' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select a date for your availability",
        variant: "destructive"
      });
      return;
    }

    if (!validateTimeSlots()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically save the manual availability to the database
      // For now, we'll just show a success message
      console.log('Manual availability:', { date: selectedDate, timeSlots });
      
      toast({
        title: "Success",
        description: "Manual availability added successfully"
      });
      
      clearForm();
      onAvailabilityAdded();
    } catch (error) {
      console.error('Error adding manual availability:', error);
      toast({
        title: "Error",
        description: "Failed to add manual availability",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    timeSlots,
    isSubmitting,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    clearForm,
    handleSubmit
  };
};
