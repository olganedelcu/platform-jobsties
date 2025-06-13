
-- Enable real-time updates for mentee_todo_assignments table
ALTER TABLE public.mentee_todo_assignments REPLICA IDENTITY FULL;

-- Add the table to the realtime publication so we can listen for changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.mentee_todo_assignments;
