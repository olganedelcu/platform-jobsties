
-- Create coaching_sessions table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentee_id UUID REFERENCES auth.users(id) NOT NULL,
  coach_id UUID REFERENCES auth.users(id),
  session_type TEXT NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  notes TEXT,
  preferred_coach TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  meeting_link TEXT,
  cal_com_event_id TEXT,
  cal_com_booking_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for coaching_sessions
CREATE POLICY "Users can view their own sessions as mentee" 
  ON public.coaching_sessions 
  FOR SELECT 
  USING (auth.uid() = mentee_id);

CREATE POLICY "Coaches can view assigned sessions" 
  ON public.coaching_sessions 
  FOR SELECT 
  USING (auth.uid() = coach_id);

CREATE POLICY "Users can create their own sessions" 
  ON public.coaching_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.coaching_sessions 
  FOR UPDATE 
  USING (auth.uid() = mentee_id OR auth.uid() = coach_id);

CREATE POLICY "Users can delete their own sessions" 
  ON public.coaching_sessions 
  FOR DELETE 
  USING (auth.uid() = mentee_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_mentee_id ON public.coaching_sessions(mentee_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_coach_id ON public.coaching_sessions(coach_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_date ON public.coaching_sessions(session_date);

-- Create webhook events table for Cal.com integration
CREATE TABLE IF NOT EXISTS public.cal_com_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  booking_id TEXT NOT NULL,
  event_data JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for webhook events (only system can access)
ALTER TABLE public.cal_com_webhooks ENABLE ROW LEVEL SECURITY;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for coaching_sessions
DROP TRIGGER IF EXISTS update_coaching_sessions_updated_at ON public.coaching_sessions;
CREATE TRIGGER update_coaching_sessions_updated_at
    BEFORE UPDATE ON public.coaching_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
