
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PostCard from './PostCard';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface CommunityFeedProps {
  userId: string;
}

const CommunityFeed = ({ userId }: CommunityFeedProps) => {
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      console.log('Fetching community posts...');
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!inner(first_name, last_name),
          post_likes(user_id),
          post_comments(
            id,
            content,
            created_at,
            profiles(first_name, last_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      
      console.log('Fetched posts:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">Be the first to share something with the community!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={userId}
          onUpdate={refetch}
        />
      ))}
    </div>
  );
};

export default CommunityFeed;
