
-- Create backup monitoring and logging tables
CREATE TABLE public.backup_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_type TEXT NOT NULL, -- 'database', 'storage', 'full'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  file_size BIGINT,
  backup_location TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create backup configurations table
CREATE TABLE public.backup_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_type TEXT NOT NULL,
  schedule_cron TEXT NOT NULL, -- Cron expression for scheduling
  retention_days INTEGER NOT NULL DEFAULT 30,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  config_data JSONB, -- Additional configuration parameters
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for backups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'backups',
  'backups',
  false, -- Private bucket for security
  104857600000, -- 100GB limit
  ARRAY['application/sql', 'application/gzip', 'application/x-tar', 'application/zip']
);

-- RLS policies for backup logs (only admins/coaches can view)
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view backup logs" ON public.backup_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- RLS policies for backup configurations
ALTER TABLE public.backup_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view backup configurations" ON public.backup_configurations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

CREATE POLICY "Coaches can update backup configurations" ON public.backup_configurations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- Storage policies for backup bucket
CREATE POLICY "Coaches can view backup files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'backups' AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'coach'
    )
  );

CREATE POLICY "System can manage backup files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'backups'
  );

-- Insert default backup configurations
INSERT INTO public.backup_configurations (backup_type, schedule_cron, retention_days, config_data) VALUES
  ('database_full', '0 2 * * *', 30, '{"compress": true, "include_schema": true}'),
  ('database_incremental', '0 */6 * * *', 7, '{"compress": true}'),
  ('storage_files', '0 3 * * *', 30, '{"compress": true, "exclude_temp": true}'),
  ('critical_tables', '0 */2 * * *', 14, '{"tables": ["profiles", "job_applications", "cv_files", "module_files", "coaching_sessions", "course_progress"]}');

-- Function to log backup operations
CREATE OR REPLACE FUNCTION public.log_backup_operation(
  p_backup_type TEXT,
  p_status TEXT,
  p_backup_location TEXT DEFAULT NULL,
  p_file_size BIGINT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  backup_log_id UUID;
BEGIN
  INSERT INTO public.backup_logs (
    backup_type, status, backup_location, file_size, error_message, metadata,
    completed_at
  ) VALUES (
    p_backup_type, p_status, p_backup_location, p_file_size, p_error_message, p_metadata,
    CASE WHEN p_status IN ('completed', 'failed') THEN now() ELSE NULL END
  ) RETURNING id INTO backup_log_id;
  
  RETURN backup_log_id;
END;
$$;

-- Function to get backup statistics
CREATE OR REPLACE FUNCTION public.get_backup_statistics()
RETURNS TABLE (
  backup_type TEXT,
  last_backup TIMESTAMP WITH TIME ZONE,
  success_rate NUMERIC,
  total_size BIGINT,
  backup_count INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    bl.backup_type,
    MAX(bl.completed_at) as last_backup,
    ROUND(
      (COUNT(*) FILTER (WHERE bl.status = 'completed')::NUMERIC / 
       NULLIF(COUNT(*), 0) * 100), 2
    ) as success_rate,
    SUM(bl.file_size) as total_size,
    COUNT(*)::INTEGER as backup_count
  FROM public.backup_logs bl
  WHERE bl.created_at > now() - interval '30 days'
  GROUP BY bl.backup_type
  ORDER BY bl.backup_type;
$$;

-- Trigger to update backup configurations updated_at
CREATE OR REPLACE FUNCTION public.update_backup_configurations_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER backup_configurations_updated_at_trigger
  BEFORE UPDATE ON public.backup_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_backup_configurations_updated_at();
