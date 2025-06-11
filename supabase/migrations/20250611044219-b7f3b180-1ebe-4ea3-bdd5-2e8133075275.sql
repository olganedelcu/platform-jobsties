
-- Create table for storing Ana's Google Calendar integration
CREATE TABLE IF NOT EXISTS public.coach_calendar_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  google_calendar_connected BOOLEAN DEFAULT FALSE,
  primary_calendar_id TEXT DEFAULT 'primary',
  sync_enabled BOOLEAN DEFAULT FALSE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coach_id)
);

-- Add RLS policies for coach calendar settings
ALTER TABLE public.coach_calendar_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can manage their calendar settings"
ON public.coach_calendar_settings
FOR ALL
USING (auth.uid() = coach_id);

-- Create table for storing calendar events from Google Calendar
CREATE TABLE IF NOT EXISTS public.coach_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  google_event_id TEXT NOT NULL,
  calendar_id TEXT NOT NULL DEFAULT 'primary',
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_available_for_booking BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coach_id, google_event_id, calendar_id)
);

-- Add RLS policies for calendar events
ALTER TABLE public.coach_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can manage their calendar events"
ON public.coach_calendar_events
FOR ALL
USING (auth.uid() = coach_id);

CREATE POLICY "Mentees can view coach availability"
ON public.coach_calendar_events
FOR SELECT
USING (is_available_for_booking = TRUE);

-- Update coaching_sessions table to better integrate with calendar
ALTER TABLE public.coaching_sessions 
ADD COLUMN IF NOT EXISTS calendar_event_id UUID REFERENCES coach_calendar_events(id),
ADD COLUMN IF NOT EXISTS is_blocking_event BOOLEAN DEFAULT TRUE;

-- Create trigger for updating calendar events
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coach_calendar_events_updated_at
    BEFORE UPDATE ON public.coach_calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION update_calendar_events_updated_at();

CREATE TRIGGER update_coach_calendar_settings_updated_at
    BEFORE UPDATE ON public.coach_calendar_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_calendar_events_updated_at();
