
-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_email VARCHAR(255) DEFAULT 'ana@jobsties.com' NOT NULL,
  subject VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('mentee', 'coach')),
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system')),
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_attachments table
CREATE TABLE public.message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
-- Mentees can only see their own conversations
CREATE POLICY "Mentees can view their own conversations" ON public.conversations
  FOR SELECT USING (mentee_id = auth.uid());

-- Coaches can see all conversations
CREATE POLICY "Coaches can view all conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'COACH'
    )
  );

-- Mentees can create conversations
CREATE POLICY "Mentees can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (mentee_id = auth.uid());

-- Both mentees and coaches can update conversations
CREATE POLICY "Users can update conversations" ON public.conversations
  FOR UPDATE USING (
    mentee_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'COACH'
    )
  );

-- RLS Policies for messages
-- Users can view messages in conversations they have access to
CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id AND (
        mentee_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'COACH'
        )
      )
    )
  );

-- Users can insert messages in conversations they have access to
CREATE POLICY "Users can insert messages in their conversations" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id AND (
        mentee_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'COACH'
        )
      )
    )
  );

-- RLS Policies for message_attachments
-- Users can view attachments in conversations they have access to
CREATE POLICY "Users can view attachments in their conversations" ON public.message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON m.conversation_id = c.id
      WHERE m.id = message_id AND (
        c.mentee_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'COACH'
        )
      )
    )
  );

-- Users can insert attachments in conversations they have access to
CREATE POLICY "Users can insert attachments in their conversations" ON public.message_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON m.conversation_id = c.id
      WHERE m.id = message_id AND (
        c.mentee_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'COACH'
        )
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_conversations_mentee_id ON public.conversations(mentee_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_message_attachments_message_id ON public.message_attachments(message_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_updated_at_trigger
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_conversations_updated_at();

-- Create storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('message-attachments', 'message-attachments', false);

-- Create storage policies for message attachments
CREATE POLICY "Users can upload message attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'message-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view message attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'message-attachments' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'COACH'
      )
    )
  );
