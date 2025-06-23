
-- Remove community-related tables and their policies
DROP TABLE IF EXISTS public.post_comments CASCADE;
DROP TABLE IF EXISTS public.post_likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;

-- Remove the security definer function that was used for community features
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Remove community-related policies from profiles table
DROP POLICY IF EXISTS "Mentees can view other mentee profiles" ON public.profiles;

-- Keep only the essential profile policies
-- (The existing policies for users viewing/updating their own profiles remain)
