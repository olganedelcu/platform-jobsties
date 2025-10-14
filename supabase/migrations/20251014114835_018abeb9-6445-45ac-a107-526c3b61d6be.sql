-- Part 3: Update remaining RLS policies for STUDENT role support

-- 5. Course Progress (Dashboard)
DROP POLICY IF EXISTS "Users can view their own progress" ON course_progress;
DROP POLICY IF EXISTS "Mentees and students can view their progress" ON course_progress;
CREATE POLICY "Mentees and students can view progress" 
ON course_progress FOR SELECT 
USING (
  auth.uid() = user_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Users can create their own progress" ON course_progress;
DROP POLICY IF EXISTS "Mentees and students can create progress" ON course_progress;
CREATE POLICY "Mentees and students create progress" 
ON course_progress FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Users can update their own progress" ON course_progress;
DROP POLICY IF EXISTS "Mentees and students can update progress" ON course_progress;
CREATE POLICY "Mentees and students update progress" 
ON course_progress FOR UPDATE 
USING (
  auth.uid() = user_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Users can delete their own progress" ON course_progress;
DROP POLICY IF EXISTS "Mentees and students can delete progress" ON course_progress;
CREATE POLICY "Mentees and students delete progress" 
ON course_progress FOR DELETE 
USING (
  auth.uid() = user_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 6. Conversations
DROP POLICY IF EXISTS "Mentees can view their own conversations" ON conversations;
CREATE POLICY "Mentees and students view conversations" 
ON conversations FOR SELECT 
USING (
  mentee_id = auth.uid() AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

DROP POLICY IF EXISTS "Mentees can create conversations" ON conversations;
CREATE POLICY "Mentees and students create conversations" 
ON conversations FOR INSERT 
WITH CHECK (
  mentee_id = auth.uid() AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 7. Weekly Job Recommendations
DROP POLICY IF EXISTS "Mentees can view their own recommendations" ON weekly_job_recommendations;
CREATE POLICY "Mentees and students view recommendations" 
ON weekly_job_recommendations FOR SELECT 
USING (
  auth.uid() = mentee_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 8. Posts (Community)
DROP POLICY IF EXISTS "Mentees can view all posts" ON posts;
CREATE POLICY "Mentees and students view posts" 
ON posts FOR SELECT 
USING (get_current_user_role() IN ('MENTEE', 'STUDENT'));

DROP POLICY IF EXISTS "Mentees can create their own posts" ON posts;
CREATE POLICY "Mentees and students create posts" 
ON posts FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 9. Post Comments
DROP POLICY IF EXISTS "Users can view all comments" ON post_comments;
CREATE POLICY "Mentees and students view comments" 
ON post_comments FOR SELECT 
USING (get_current_user_role() IN ('MENTEE', 'STUDENT'));

DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Mentees and students create comments" 
ON post_comments FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);

-- 10. Post Likes
DROP POLICY IF EXISTS "Users can view all likes" ON post_likes;
CREATE POLICY "Mentees and students view likes" 
ON post_likes FOR SELECT 
USING (get_current_user_role() IN ('MENTEE', 'STUDENT'));

DROP POLICY IF EXISTS "Users can create their own likes" ON post_likes;
CREATE POLICY "Mentees and students create likes" 
ON post_likes FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  get_current_user_role() IN ('MENTEE', 'STUDENT')
);