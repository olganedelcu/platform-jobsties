
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare } from 'lucide-react';
import CommunityFeed from './CommunityFeed';
import MenteeProfiles from './MenteeProfiles';
import CreatePostForm from './CreatePostForm';

interface CommunityContentProps {
  user: any;
}

const CommunityContent = ({ user }: CommunityContentProps) => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">Connect with fellow mentees, share your journey, and learn from each other</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Community Feed
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Mentee Profiles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CreatePostForm userId={user.id} />
            </CardContent>
          </Card>
          <CommunityFeed userId={user.id} />
        </TabsContent>

        <TabsContent value="profiles">
          <MenteeProfiles currentUserId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityContent;
