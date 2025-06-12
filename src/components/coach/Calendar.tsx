
import React from 'react';
import { useCalendarState } from '@/hooks/useCalendarState';
import CalendarHeader from './CalendarHeader';
import CalendarConnectionStatus from './CalendarConnectionStatus';
import CalendarView from './CalendarView';
import CalendarEventsView from './CalendarEventsView';
import CalendarSettings from './CalendarSettings';
import ManualAvailabilityForm from './ManualAvailabilityForm';

interface CoachCalendarProps {
  coachId: string;
}

const CoachCalendar = ({ coachId }: CoachCalendarProps) => {
  const {
    selectedDate,
    setSelectedDate,
    events,
    loading,
    showSettings,
    setShowSettings,
    showManualForm,
    setShowManualForm,
    loadCalendarData,
    getEventsForDate
  } = useCalendarState(coachId);

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <CalendarHeader
        onAddAvailability={() => setShowManualForm(!showManualForm)}
        onShowSettings={() => setShowSettings(!showSettings)}
        loading={loading}
      />

      <CalendarConnectionStatus />

      {showManualForm && (
        <ManualAvailabilityForm
          onAvailabilityAdded={() => {
            setShowManualForm(false);
            loadCalendarData();
          }}
        />
      )}

      {showSettings && <CalendarSettings />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalendarView
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          getEventsForDate={getEventsForDate}
        />

        <CalendarEventsView
          selectedDate={selectedDate}
          events={selectedDateEvents}
          onEventUpdate={() => loadCalendarData()}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CoachCalendar;
