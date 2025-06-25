
-- Allow null mentee_id for guest sessions in coaching_sessions table
ALTER TABLE public.coaching_sessions 
ALTER COLUMN mentee_id DROP NOT NULL;

-- Add a comment to document this change
COMMENT ON COLUMN public.coaching_sessions.mentee_id IS 'Mentee ID - can be null for guest sessions booked via Cal.com';
