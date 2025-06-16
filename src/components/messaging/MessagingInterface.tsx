
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ConversationsList from './ConversationsList';
import MessageThread from './MessageThread';
import NewConversationDialog from './NewConversationDialog';
import { useConversations } from '@/hooks/useConversations';

interface MessagingInterfaceProps {
  initialConversationId?: string | null;
}

const MessagingInterface = ({ initialConversationId }: MessagingInterfaceProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { conversations, loading, createConversation } = useConversations();

  // Set initial conversation if provided
  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conversationExists = conversations.find(c => c.id === initialConversationId);
      if (conversationExists) {
        setSelectedConversationId(initialConversationId);
      }
    }
  }, [initialConversationId, conversations]);

  const handleNewConversation = async (subject: string, initialMessage?: string) => {
    const newConversation = await createConversation(subject, initialMessage);
    if (newConversation) {
      setSelectedConversationId(newConversation.id);
      setShowNewConversation(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with your coach and manage conversations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ConversationsList
            conversations={conversations}
            loading={loading}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            onNewConversation={() => setShowNewConversation(true)}
          />
        </div>

        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <MessageThread 
              conversationId={selectedConversationId}
            />
          </Card>
        </div>
      </div>

      <NewConversationDialog
        open={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onCreateConversation={handleNewConversation}
      />
    </div>
  );
};

export default MessagingInterface;
