
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useManualAvailabilityForm } from '@/hooks/useManualAvailabilityForm';
import DateSelector from './availability/DateSelector';
import TimeSlotsSection from './availability/TimeSlotsSection';
import FormActions from './availability/FormActions';

interface ManualAvailabilityFormProps {
  onAvailabilityAdded: () => void;
}

const ManualAvailabilityForm = ({ onAvailabilityAdded }: ManualAvailabilityFormProps) => {
  const {
    selectedDate,
    setSelectedDate,
    timeSlots,
    isSubmitting,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    clearForm,
    handleSubmit
  } = useManualAvailabilityForm(onAvailabilityAdded);

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
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            minDate={minDate}
          />

          <TimeSlotsSection
            timeSlots={timeSlots}
            onAddTimeSlot={addTimeSlot}
            onUpdateTimeSlot={updateTimeSlot}
            onRemoveTimeSlot={removeTimeSlot}
          />

          <FormActions
            onClear={clearForm}
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualAvailabilityForm;
