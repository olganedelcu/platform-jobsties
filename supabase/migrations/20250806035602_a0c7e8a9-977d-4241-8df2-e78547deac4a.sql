-- Create the missing profile for Olabiyi Babafemi
INSERT INTO public.profiles (id, first_name, last_name, email, role)
VALUES (
  'f369ee69-6518-47de-922e-2c6423f69c8c',
  'Olabiyi',
  'Babafemi', 
  'olabiyi.babafemi@gmail.com',
  'MENTEE'
);

-- Check for any other users missing profiles and create them
INSERT INTO public.profiles (id, first_name, last_name, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'first_name', ''),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  au.email,
  CASE 
    WHEN UPPER(COALESCE(au.raw_user_meta_data->>'role', 'MENTEE')) = 'COACH' THEN 'COACH'
    ELSE 'MENTEE'
  END
FROM auth.users au 
LEFT JOIN profiles p ON au.id = p.id 
WHERE p.id IS NULL
  AND au.id != 'f369ee69-6518-47de-922e-2c6423f69c8c'; -- Exclude the one we already inserted