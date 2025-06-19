
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare } from 'lucide-react';

interface MenteeProfilesProps {
  currentUserId: string;
}

const MenteeProfiles = ({ currentUserId }: MenteeProfilesProps) => {
  const { data: mentees, isLoading } = useQuery({
    queryKey: ['mentee-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_profiles(about, location),
          posts(id),
          post_likes(id),
          post_comments(id)
        `)
        .eq('role', 'MENTEE')
        .neq('id', currentUserId);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 text-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!mentees || mentees.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No other mentees found</h3>
          <p className="text-gray-500">Check back later to see other community members!</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mentee Profiles</h2>
        <p className="text-gray-600">Connect with {mentees.length} other mentees in the community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentees.map((mentee) => {
          const postsCount = mentee.posts?.length || 0;
          const likesCount = mentee.post_likes?.length || 0;
          const commentsCount = mentee.post_comments?.length || 0;
          const userProfile = Array.isArray(mentee.user_profiles) ? mentee.user_profiles[0] : null;

          return (
            <Card key={mentee.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
                      {getInitials(mentee.first_name, mentee.last_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {mentee.first_name} {mentee.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{mentee.email}</p>
                    
                    {userProfile?.location && (
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {userProfile.location}
                      </p>
                    )}
                  </div>

                  {userProfile?.about && (
                    <p className="text-sm text-gray-700 text-center line-clamp-3">
                      {userProfile.about}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="text-xs">
                      {postsCount} Posts
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {likesCount} Likes
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {commentsCount} Comments
                    </Badge>
                  </div>

                  <div className="w-full pt-4 border-t">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>Active community member</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MenteeProfiles;
