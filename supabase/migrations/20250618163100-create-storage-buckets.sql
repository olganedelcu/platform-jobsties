
-- Create storage buckets for CV files and module files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'cv-files',
    'cv-files',
    false,
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  ),
  (
    'module-files',
    'module-files', 
    false,
    52428800, -- 50MB limit
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  )
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for cv-files bucket
CREATE POLICY "Allow authenticated users to upload CV files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cv-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to view CV files they have access to"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cv-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow coaches to delete CV files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cv-files' AND
  auth.role() = 'authenticated'
);

-- Create storage policies for module-files bucket
CREATE POLICY "Allow authenticated users to upload module files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'module-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to view module files they have access to"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'module-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow coaches to delete module files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'module-files' AND
  auth.role() = 'authenticated'
);
