
-- Update the backups bucket to allow JSON files
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['application/sql', 'application/gzip', 'application/x-tar', 'application/zip', 'application/json', 'text/plain']
WHERE id = 'backups';
