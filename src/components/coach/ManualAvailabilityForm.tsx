
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  start: string;
  end: string;
}

interface ManualAvailabilityFormProps {
  onAvailabilityAdded: () => void;
}

const ManualAvailabilityForm = ({ onAvailabilityAdded }: ManualAvailabilityFormProps) => {
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
      
      // Reset form
      setSelectedDate('');
      setTimeSlots([{ start: '09:00', end: '10:00' }]);
      
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

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Manual Availability</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Available Time Slots</span>
            </Label>
            
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                    className="w-32"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                    className="w-32"
                  />
                  <Badge variant="outline" className="ml-2">
                    {slot.start} - {slot.end}
                  </Badge>
                </div>
                
                {timeSlots.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeSlot(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeSlot}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Time Slot
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedDate('');
                setTimeSlots([{ start: '09:00', end: '10:00' }]);
              }}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Availability'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualAvailabilityForm;
