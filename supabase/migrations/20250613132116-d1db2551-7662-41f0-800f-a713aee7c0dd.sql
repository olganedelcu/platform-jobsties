
-- Create a table to track todo assignments sent to mentees
CREATE TABLE public.mentee_todo_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL,
  mentee_id UUID NOT NULL,
  todo_id UUID NOT NULL REFERENCES public.coach_todos(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for mentee_todo_assignments
ALTER TABLE public.mentee_todo_assignments ENABLE ROW LEVEL SECURITY;

-- Coaches can view assignments they created
CREATE POLICY "Coaches can view their todo assignments" 
  ON public.mentee_todo_assignments 
  FOR SELECT 
  USING (coach_id = auth.uid());

-- Coaches can create assignments
CREATE POLICY "Coaches can create todo assignments" 
  ON public.mentee_todo_assignments 
  FOR INSERT 
  WITH CHECK (coach_id = auth.uid());

-- Coaches can update assignments they created
CREATE POLICY "Coaches can update their todo assignments" 
  ON public.mentee_todo_assignments 
  FOR UPDATE 
  USING (coach_id = auth.uid());

-- Mentees can view assignments sent to them
CREATE POLICY "Mentees can view their todo assignments" 
  ON public.mentee_todo_assignments 
  FOR SELECT 
  USING (mentee_id = auth.uid());

-- Mentees can update status of assignments sent to them
CREATE POLICY "Mentees can update their todo assignment status" 
  ON public.mentee_todo_assignments 
  FOR UPDATE 
  USING (mentee_id = auth.uid());

-- Create a table for mentee personal todos
CREATE TABLE public.mentee_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for mentee_todos
ALTER TABLE public.mentee_todos ENABLE ROW LEVEL SECURITY;

-- Mentees can manage their own todos
CREATE POLICY "Mentees can manage their own todos" 
  ON public.mentee_todos 
  FOR ALL 
  USING (mentee_id = auth.uid()) 
  WITH CHECK (mentee_id = auth.uid());

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_mentee_todo_assignments_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_mentee_todo_assignments_updated_at
  BEFORE UPDATE ON public.mentee_todo_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_mentee_todo_assignments_updated_at();

CREATE OR REPLACE FUNCTION public.update_mentee_todos_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_mentee_todos_updated_at
  BEFORE UPDATE ON public.mentee_todos
  FOR EACH ROW EXECUTE FUNCTION public.update_mentee_todos_updated_at();

-- Add function to automatically update started_at and completed_at based on status changes
CREATE OR REPLACE FUNCTION public.update_assignment_timestamps()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Set started_at when status changes to 'in_progress' for the first time
  IF OLD.status = 'pending' AND NEW.status = 'in_progress' AND NEW.started_at IS NULL THEN
    NEW.started_at = now();
  END IF;
  
  -- Set completed_at when status changes to 'completed'
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    NEW.completed_at = now();
    -- Also set started_at if it wasn't set
    IF NEW.started_at IS NULL THEN
      NEW.started_at = now();
    END IF;
  END IF;
  
  -- Clear completed_at if status changes away from 'completed'
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_assignment_timestamps
  BEFORE UPDATE ON public.mentee_todo_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_assignment_timestamps();
