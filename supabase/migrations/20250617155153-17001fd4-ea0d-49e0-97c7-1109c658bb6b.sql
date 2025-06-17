
-- Add cal_com_booking_id field to coaching_sessions table
ALTER TABLE public.coaching_sessions 
ADD COLUMN cal_com_booking_id TEXT;

-- Create an index for better performance when looking up sessions by Cal.com booking ID
CREATE INDEX idx_coaching_sessions_cal_com_booking_id 
ON public.coaching_sessions(cal_com_booking_id);
