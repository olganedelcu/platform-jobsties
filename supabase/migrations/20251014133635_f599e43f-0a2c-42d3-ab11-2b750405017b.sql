-- Secure Google OAuth tokens with encryption and stricter access controls

-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a secure function to store encrypted tokens
CREATE OR REPLACE FUNCTION public.encrypt_token(token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key text;
BEGIN
  -- Use a secret from vault or environment
  encryption_key := current_setting('app.settings.encryption_key', true);
  IF encryption_key IS NULL THEN
    encryption_key := 'default_key_please_change_in_production';
  END IF;
  
  RETURN encode(
    encrypt(
      token::bytea,
      encryption_key::bytea,
      'aes'
    ),
    'base64'
  );
END;
$$;

-- Create a secure function to decrypt tokens
CREATE OR REPLACE FUNCTION public.decrypt_token(encrypted_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key text;
BEGIN
  -- Use a secret from vault or environment
  encryption_key := current_setting('app.settings.encryption_key', true);
  IF encryption_key IS NULL THEN
    encryption_key := 'default_key_please_change_in_production';
  END IF;
  
  RETURN convert_from(
    decrypt(
      decode(encrypted_token, 'base64'),
      encryption_key::bytea,
      'aes'
    ),
    'utf8'
  );
END;
$$;

-- Update RLS policies for coach_google_tokens to be more restrictive
DROP POLICY IF EXISTS "Coaches can only access their own tokens" ON coach_google_tokens;

-- Super restrictive: only allow access through service role (backend functions)
CREATE POLICY "Service role only access for coach tokens"
ON coach_google_tokens
FOR ALL
USING (
  -- Only allow if called from a security definer function or service role
  current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
);

-- Update RLS policies for user_google_tokens to be more restrictive
DROP POLICY IF EXISTS "Users can manage their own tokens" ON user_google_tokens;

-- Super restrictive: only allow access through service role (backend functions)
CREATE POLICY "Service role only access for user tokens"
ON user_google_tokens
FOR ALL
USING (
  -- Only allow if called from a security definer function or service role
  current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
);

-- Create secure functions to get tokens (only these should be called from edge functions)
CREATE OR REPLACE FUNCTION public.get_user_google_token(user_uuid uuid)
RETURNS TABLE (
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the requesting user is the token owner
  IF auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Unauthorized access to tokens';
  END IF;
  
  RETURN QUERY
  SELECT 
    decrypt_token(ugt.access_token) as access_token,
    decrypt_token(ugt.refresh_token) as refresh_token,
    ugt.expires_at
  FROM user_google_tokens ugt
  WHERE ugt.user_id = user_uuid;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_coach_google_token(coach_email_param text)
RETURNS TABLE (
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_email text;
BEGIN
  -- Get current user's email
  SELECT email INTO current_user_email
  FROM profiles
  WHERE id = auth.uid() AND role = 'COACH';
  
  -- Verify the requesting user owns these tokens
  IF current_user_email != coach_email_param THEN
    RAISE EXCEPTION 'Unauthorized access to tokens';
  END IF;
  
  RETURN QUERY
  SELECT 
    decrypt_token(cgt.access_token) as access_token,
    CASE 
      WHEN cgt.refresh_token IS NOT NULL THEN decrypt_token(cgt.refresh_token)
      ELSE NULL
    END as refresh_token,
    cgt.expires_at
  FROM coach_google_tokens cgt
  WHERE cgt.coach_email = coach_email_param;
END;
$$;

-- Create secure function to store/update tokens
CREATE OR REPLACE FUNCTION public.store_user_google_token(
  user_uuid uuid,
  access_tok text,
  refresh_tok text,
  expires timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the requesting user is storing their own tokens
  IF auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Unauthorized token storage';
  END IF;
  
  INSERT INTO user_google_tokens (
    user_id,
    access_token,
    refresh_token,
    expires_at
  ) VALUES (
    user_uuid,
    encrypt_token(access_tok),
    encrypt_token(refresh_tok),
    expires
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    access_token = encrypt_token(access_tok),
    refresh_token = encrypt_token(refresh_tok),
    expires_at = expires,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.store_coach_google_token(
  coach_email_param text,
  access_tok text,
  refresh_tok text,
  expires timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_email text;
BEGIN
  -- Get current user's email
  SELECT email INTO current_user_email
  FROM profiles
  WHERE id = auth.uid() AND role = 'COACH';
  
  -- Verify the requesting user is storing their own tokens
  IF current_user_email != coach_email_param THEN
    RAISE EXCEPTION 'Unauthorized token storage';
  END IF;
  
  INSERT INTO coach_google_tokens (
    coach_email,
    access_token,
    refresh_token,
    expires_at
  ) VALUES (
    coach_email_param,
    encrypt_token(access_tok),
    CASE WHEN refresh_tok IS NOT NULL THEN encrypt_token(refresh_tok) ELSE NULL END,
    expires
  )
  ON CONFLICT (coach_email) 
  DO UPDATE SET
    access_token = encrypt_token(access_tok),
    refresh_token = CASE WHEN refresh_tok IS NOT NULL THEN encrypt_token(refresh_tok) ELSE coach_google_tokens.refresh_token END,
    expires_at = expires,
    updated_at = now();
END;
$$;

-- Add comment to document security measures
COMMENT ON TABLE coach_google_tokens IS 'OAuth tokens are encrypted at rest and only accessible through security definer functions';
COMMENT ON TABLE user_google_tokens IS 'OAuth tokens are encrypted at rest and only accessible through security definer functions';