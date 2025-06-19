
-- Fix the foreign key relationships for community features

-- First, let's update the posts table to properly reference profiles
ALTER TABLE public.posts 
DROP CONSTRAINT IF EXISTS posts_user_id_fkey;

ALTER TABLE public.posts
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update post_likes to reference profiles
ALTER TABLE public.post_likes
DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;

ALTER TABLE public.post_likes
ADD CONSTRAINT post_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update post_comments to reference profiles  
ALTER TABLE public.post_comments
DROP CONSTRAINT IF EXISTS post_comments_user_id_fkey;

ALTER TABLE public.post_comments
ADD CONSTRAINT post_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix user_profiles to properly reference profiles
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add proper RLS policies for the community features
-- Posts policies (allow mentees to view all posts, create their own)
DROP POLICY IF EXISTS "Mentees can view all posts" ON public.posts;
CREATE POLICY "Mentees can view all posts" 
  ON public.posts 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'MENTEE'
    )
  );

DROP POLICY IF EXISTS "Mentees can create their own posts" ON public.posts;
CREATE POLICY "Mentees can create their own posts" 
  ON public.posts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'MENTEE'
    )
  );

-- Update likes policies
DROP POLICY IF EXISTS "Users can view all likes" ON public.post_likes;
CREATE POLICY "Users can view all likes" 
  ON public.post_likes 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'MENTEE'
    )
  );

DROP POLICY IF EXISTS "Users can create their own likes" ON public.post_likes;
CREATE POLICY "Users can create their own likes" 
  ON public.post_likes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'MENTEE'
    )
  );

-- Update comments policies
DROP POLICY IF EXISTS "Users can view all comments" ON public.post_comments;
CREATE POLICY "Users can view all comments" 
  ON public.post_comments 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'MENTEE'
    )
  );

DROP POLICY IF EXISTS "Users can create comments" ON public.post_comments;
CREATE POLICY "Users can create comments" 
  ON public.post_comments 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'MENTEE'
    )
  );

-- Add policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add policy for profiles to allow mentees to view other mentee profiles
DROP POLICY IF EXISTS "Mentees can view other mentee profiles" ON public.profiles;
CREATE POLICY "Mentees can view other mentee profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'MENTEE'
    )
  );
