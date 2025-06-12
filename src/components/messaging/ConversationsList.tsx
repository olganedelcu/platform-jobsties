
import React from 'react';
import ConversationItem from './ConversationItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Conversation {
  id: string;
  subject: string;
  coach_email: string;
  updated_at: string;
  latest_message?: string;
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  loading: boolean;
}

const ConversationsList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation,
  onCreateConversation,
  loading 
}: ConversationsListProps) => {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Loading conversations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Conversations</CardTitle>
          <Button 
            size="sm" 
            onClick={onCreateConversation}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet. Start a new one!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
