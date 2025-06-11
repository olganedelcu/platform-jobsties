
import React from 'react';
import { useAvailabilitySettings } from '@/hooks/useAvailabilitySettings';
import WeeklyAvailabilityCard from './availability/WeeklyAvailabilityCard';
import BlockedDatesCard from './availability/BlockedDatesCard';
import AvailabilityLoadingCard from './availability/AvailabilityLoadingCard';

interface AvailabilitySettingsProps {
  coachId: string;
}

const AvailabilitySettings = ({ coachId }: AvailabilitySettingsProps) => {
  const {
    availability,
    blockedDates,
    newBlockedDate,
    loading,
    saving,
    setNewBlockedDate,
    updateAvailability,
    saveAvailability,
    addBlockedDate,
    removeBlockedDate
  } = useAvailabilitySettings(coachId);

  if (loading) {
    return <AvailabilityLoadingCard />;
  }

  return (
    <div className="space-y-6">
      <WeeklyAvailabilityCard
        availability={availability}
        onUpdateAvailability={updateAvailability}
        onSave={saveAvailability}
        saving={saving}
      />

      <BlockedDatesCard
        blockedDates={blockedDates}
        newBlockedDate={newBlockedDate}
        onNewBlockedDateChange={setNewBlockedDate}
        onAddBlockedDate={addBlockedDate}
        onRemoveBlockedDate={removeBlockedDate}
      />
    </div>
  );
};

export default AvailabilitySettings;
