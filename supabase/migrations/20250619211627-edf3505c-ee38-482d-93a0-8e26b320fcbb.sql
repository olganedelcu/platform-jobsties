
-- First, let's drop the existing problematic policies
DROP POLICY IF EXISTS "Mentees can view other mentee profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a simple security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow mentees to view other mentee profiles (for community features)
CREATE POLICY "Mentees can view other mentee profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    role = 'MENTEE' AND 
    public.get_current_user_role() = 'MENTEE'
  );

-- Fix the community tables policies to use the security definer function
-- Update posts policies
DROP POLICY IF EXISTS "Mentees can view all posts" ON public.posts;
CREATE POLICY "Mentees can view all posts" 
  ON public.posts 
  FOR SELECT 
  TO authenticated
  USING (public.get_current_user_role() = 'MENTEE');

DROP POLICY IF EXISTS "Mentees can create their own posts" ON public.posts;
CREATE POLICY "Mentees can create their own posts" 
  ON public.posts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    public.get_current_user_role() = 'MENTEE'
  );

-- Update post_likes policies
DROP POLICY IF EXISTS "Users can view all likes" ON public.post_likes;
CREATE POLICY "Users can view all likes" 
  ON public.post_likes 
  FOR SELECT 
  TO authenticated
  USING (public.get_current_user_role() = 'MENTEE');

DROP POLICY IF EXISTS "Users can create their own likes" ON public.post_likes;
CREATE POLICY "Users can create their own likes" 
  ON public.post_likes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    public.get_current_user_role() = 'MENTEE'
  );

-- Update post_comments policies
DROP POLICY IF EXISTS "Users can view all comments" ON public.post_comments;
CREATE POLICY "Users can view all comments" 
  ON public.post_comments 
  FOR SELECT 
  TO authenticated
  USING (public.get_current_user_role() = 'MENTEE');

DROP POLICY IF EXISTS "Users can create comments" ON public.post_comments;
CREATE POLICY "Users can create comments" 
  ON public.post_comments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    public.get_current_user_role() = 'MENTEE'
  );
