
-- Create mentee_notes table for coaches to add notes about their mentees
CREATE TABLE public.mentee_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mentee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(coach_id, mentee_id)
);

-- Enable RLS
ALTER TABLE public.mentee_notes ENABLE ROW LEVEL SECURITY;

-- Policy for coaches to manage their own mentee notes
CREATE POLICY "Coaches can manage their mentee notes" ON public.mentee_notes
    FOR ALL USING (auth.uid() = coach_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on mentee_notes
CREATE TRIGGER handle_mentee_notes_updated_at
    BEFORE UPDATE ON public.mentee_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
