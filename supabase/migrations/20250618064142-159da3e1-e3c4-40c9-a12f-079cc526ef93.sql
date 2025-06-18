
-- Create RLS policies for message_attachments table
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

-- Allow users to view attachments for messages in conversations they're part of
CREATE POLICY "Users can view message attachments in their conversations"
  ON public.message_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON m.conversation_id = c.id
      WHERE m.id = message_attachments.message_id
      AND (c.mentee_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() 
        AND p.email = c.coach_email 
        AND p.role = 'COACH'
      ))
    )
  );

-- Allow users to insert attachments for their own messages
CREATE POLICY "Users can insert attachments for their own messages"
  ON public.message_attachments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_attachments.message_id
      AND m.sender_id = auth.uid()
    )
  );

-- Allow users to delete their own message attachments
CREATE POLICY "Users can delete their own message attachments"
  ON public.message_attachments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_attachments.message_id
      AND m.sender_id = auth.uid()
    )
  );

-- Create storage policies for message-attachments bucket
CREATE POLICY "Users can upload attachments to their own messages"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'message-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view attachments in their conversations"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'message-attachments'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM public.message_attachments ma
        JOIN public.messages m ON ma.message_id = m.id
        JOIN public.conversations c ON m.conversation_id = c.id
        WHERE ma.file_path = name
        AND (c.mentee_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.profiles p 
          WHERE p.id = auth.uid() 
          AND p.email = c.coach_email 
          AND p.role = 'COACH'
        ))
      )
    )
  );

CREATE POLICY "Users can delete their own attachment files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'message-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
