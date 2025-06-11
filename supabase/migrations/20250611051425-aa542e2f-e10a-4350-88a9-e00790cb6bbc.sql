
-- Create indexes for unindexed foreign keys to improve query performance

-- Index for cv_files.mentee_id foreign key
CREATE INDEX IF NOT EXISTS idx_cv_files_mentee_id ON public.cv_files (mentee_id);

-- Index for cv_files.coach_id foreign key (additional coverage)
CREATE INDEX IF NOT EXISTS idx_cv_files_coach_id ON public.cv_files (coach_id);

-- Index for course_progress.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON public.course_progress (user_id);

-- Index for coaching_sessions.mentee_id foreign key
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_mentee_id ON public.coaching_sessions (mentee_id);

-- Index for coaching_sessions.coach_id foreign key
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_coach_id ON public.coaching_sessions (coach_id);

-- Index for coaching_sessions.calendar_event_id foreign key
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_calendar_event_id ON public.coaching_sessions (calendar_event_id);

-- Index for coach_mentee_assignments.mentee_id foreign key
CREATE INDEX IF NOT EXISTS idx_coach_mentee_assignments_mentee_id ON public.coach_mentee_assignments (mentee_id);

-- Index for coach_mentee_assignments.coach_id foreign key (additional coverage)
CREATE INDEX IF NOT EXISTS idx_coach_mentee_assignments_coach_id ON public.coach_mentee_assignments (coach_id);

-- Additional useful indexes for other foreign keys that might benefit from indexing
CREATE INDEX IF NOT EXISTS idx_coach_todos_mentee_id ON public.coach_todos (mentee_id);
CREATE INDEX IF NOT EXISTS idx_coach_todos_coach_id ON public.coach_todos (coach_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_mentee_id ON public.job_applications (mentee_id);
CREATE INDEX IF NOT EXISTS idx_coach_availability_coach_id ON public.coach_availability (coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_blocked_dates_coach_id ON public.coach_blocked_dates (coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_calendar_events_coach_id ON public.coach_calendar_events (coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_calendar_settings_coach_id ON public.coach_calendar_settings (coach_id);
