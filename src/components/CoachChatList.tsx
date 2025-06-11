
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface CoachChatListProps {
  coachId: string;
}

const CoachChatList = ({ coachId }: CoachChatListProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Chat Conversations</h2>
      
      <Card>
        <CardContent className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chat feature has been removed</h3>
          <p className="text-gray-500">This functionality is no longer available.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachChatList;
