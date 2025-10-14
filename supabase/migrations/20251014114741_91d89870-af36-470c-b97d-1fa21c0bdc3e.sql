-- Part 2: Update RLS policies for mentee-related tables to support STUDENT role

-- 1. Job Applications (Tracker)
DROP POLICY IF EXISTS "Mentees can view their own applications" ON job_applications;
CREATE POLICY "Mentees and students can view their applications" 
ON job_applications FOR SELECT 
USING (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can create their own applications" ON job_applications;
DROP POLICY IF EXISTS "Mentees can insert their own applications" ON job_applications;
CREATE POLICY "Mentees and students can create applications" 
ON job_applications FOR INSERT 
WITH CHECK (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can update their own applications" ON job_applications;
CREATE POLICY "Mentees and students can update applications" 
ON job_applications FOR UPDATE 
USING (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can delete their own applications" ON job_applications;
CREATE POLICY "Mentees and students can delete applications" 
ON job_applications FOR DELETE 
USING (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 2. Mentee Todos (Notes/Tasks)
DROP POLICY IF EXISTS "Mentees can manage their own todos" ON mentee_todos;
CREATE POLICY "Mentees and students can manage todos" 
ON mentee_todos FOR ALL 
USING (
  mentee_id = auth.uid() AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
) 
WITH CHECK (
  mentee_id = auth.uid() AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 3. Mentee Todo Assignments
DROP POLICY IF EXISTS "Mentees can view their assignments" ON mentee_todo_assignments;
CREATE POLICY "Mentees and students can view assignments" 
ON mentee_todo_assignments FOR SELECT 
USING (
  mentee_id = auth.uid() AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can update their assignment details" ON mentee_todo_assignments;
DROP POLICY IF EXISTS "Mentees can update their assignment status" ON mentee_todo_assignments;
CREATE POLICY "Mentees and students can update assignments" 
ON mentee_todo_assignments FOR UPDATE 
USING (
  mentee_id = auth.uid() AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
) 
WITH CHECK (
  mentee_id = auth.uid() AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 4. Coaching Sessions (Dashboard)
DROP POLICY IF EXISTS "Mentees can view their own sessions" ON coaching_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions as mentee" ON coaching_sessions;
CREATE POLICY "Mentees and students can view sessions" 
ON coaching_sessions FOR SELECT 
USING (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can create their own sessions" ON coaching_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON coaching_sessions;
CREATE POLICY "Mentees and students can create sessions" 
ON coaching_sessions FOR INSERT 
WITH CHECK (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can update their own sessions" ON coaching_sessions;
CREATE POLICY "Mentees and students can update sessions" 
ON coaching_sessions FOR UPDATE 
USING (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can delete their own sessions" ON coaching_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON coaching_sessions;
CREATE POLICY "Mentees and students can delete sessions" 
ON coaching_sessions FOR DELETE 
USING (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);