
-- Add read_at timestamp to messages table for tracking when messages are read
ALTER TABLE public.messages 
ADD COLUMN read_at timestamp with time zone;

-- Create notifications table for managing user notifications
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  notification_type text NOT NULL DEFAULT 'message',
  title text NOT NULL,
  content text,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to update their own notifications
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for inserting notifications (system can create notifications for any user)
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Create policy for deleting notifications
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_conversation_id ON public.notifications(conversation_id);
CREATE INDEX idx_messages_read_at ON public.messages(read_at);

-- Create function to update notifications updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Create trigger for notifications updated_at
CREATE TRIGGER update_notifications_updated_at_trigger
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notifications_updated_at();

-- Create function to automatically create notifications when new messages are sent
CREATE OR REPLACE FUNCTION public.create_message_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  recipient_id uuid;
  conversation_record record;
  sender_name text;
BEGIN
  -- Get conversation details
  SELECT * INTO conversation_record
  FROM public.conversations
  WHERE id = NEW.conversation_id;

  -- Get sender name
  SELECT CONCAT(first_name, ' ', last_name) INTO sender_name
  FROM public.profiles
  WHERE id = NEW.sender_id;

  -- Determine recipient based on sender type
  IF NEW.sender_type = 'mentee' THEN
    -- If mentee sent message, notify coach
    SELECT id INTO recipient_id
    FROM public.profiles
    WHERE email = conversation_record.coach_email AND role = 'COACH';
  ELSE
    -- If coach sent message, notify mentee
    recipient_id := conversation_record.mentee_id;
  END IF;

  -- Create notification for recipient if found
  IF recipient_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      message_id,
      conversation_id,
      notification_type,
      title,
      content
    ) VALUES (
      recipient_id,
      NEW.id,
      NEW.conversation_id,
      'message',
      CONCAT('New message from ', COALESCE(sender_name, 'Unknown')),
      LEFT(NEW.content, 100)
    );
  END IF;

  RETURN NEW;
END;
$function$;

-- Create trigger to auto-create notifications for new messages
CREATE TRIGGER create_message_notification_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.create_message_notification();

-- Create function to mark notifications as read when messages are read
CREATE OR REPLACE FUNCTION public.mark_notifications_read_on_message_read()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- If read_at was just set (message was marked as read)
  IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
    -- Mark related notifications as read
    UPDATE public.notifications
    SET 
      is_read = true,
      read_at = NEW.read_at,
      updated_at = now()
    WHERE message_id = NEW.id
      AND is_read = false;
  END IF;

  RETURN NEW;
END;
$function$;

-- Create trigger to auto-mark notifications as read when messages are read
CREATE TRIGGER mark_notifications_read_trigger
  AFTER UPDATE OF read_at ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_notifications_read_on_message_read();

-- Enable realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
