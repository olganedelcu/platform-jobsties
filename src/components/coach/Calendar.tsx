
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
    settings,
    loading,
    showSettings,
    setShowSettings,
    showManualForm,
    setShowManualForm,
    loadCalendarData,
    handleSyncCalendar,
    getEventsForDate
  } = useCalendarState(coachId);

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      <CalendarHeader
        onAddAvailability={() => setShowManualForm(!showManualForm)}
        onShowSettings={() => setShowSettings(!showSettings)}
        onSyncCalendar={handleSyncCalendar}
        isGoogleConnected={settings.google_calendar_connected}
        loading={loading}
      />

      <CalendarConnectionStatus
        isConnected={settings.google_calendar_connected}
        lastSyncAt={settings.last_sync_at}
      />

      {showManualForm && (
        <ManualAvailabilityForm
          onAvailabilityAdded={() => {
            setShowManualForm(false);
            loadCalendarData();
          }}
        />
      )}

      {showSettings && (
        <CalendarSettings
          settings={settings}
          onSettingsUpdate={() => loadCalendarData()}
          coachId={coachId}
        />
      )}

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
