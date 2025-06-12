
import React from 'react';
import { useConversations } from '@/hooks/useConversations';
import ConversationItem from './ConversationItem';

interface ConversationsListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationsList = ({ selectedConversationId, onSelectConversation }: ConversationsListProps) => {
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">No conversations yet</div>
      </div>
    );
  }

  return (
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
  );
};

export default ConversationsList;
