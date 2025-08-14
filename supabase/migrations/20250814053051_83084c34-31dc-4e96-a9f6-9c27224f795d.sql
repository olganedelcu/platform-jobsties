-- Fix critical security vulnerability in coach_google_tokens table
-- Replace the overly permissive policy with a secure one

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Allow service access to coach tokens" ON coach_google_tokens;

-- Create a secure policy that only allows coaches to access their own tokens
CREATE POLICY "Coaches can only access their own tokens" 
ON coach_google_tokens 
FOR ALL 
USING (
  coach_email = (
    SELECT email 
    FROM profiles 
    WHERE id = auth.uid() AND role = 'COACH'
  )
)
WITH CHECK (
  coach_email = (
    SELECT email 
    FROM profiles 
    WHERE id = auth.uid() AND role = 'COACH'
  )
);