
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ConversationsList from './ConversationsList';
import MessageThreadContainer from './MessageThreadContainer';
import MessageInput from './MessageInput';
import NewConversationDialog from './NewConversationDialog';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';

interface MessagingInterfaceProps {
  initialConversationId?: string | null;
}

const MessagingInterface = ({ initialConversationId }: MessagingInterfaceProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { conversations, loading, createConversation, updateConversationStatus } = useConversations();
  const { sendMessage, sending } = useMessages(selectedConversationId);

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

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (selectedConversationId) {
      await sendMessage(content, attachments);
    }
  };

  const handleArchiveConversation = async (conversationId: string) => {
    await updateConversationStatus(conversationId, 'archived');
    // If the archived conversation was selected, clear the selection
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
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
            onArchiveConversation={handleArchiveConversation}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-col h-[600px]">
            <div className="flex-1">
              <MessageThreadContainer 
                conversationId={selectedConversationId}
              />
            </div>
            {selectedConversationId && (
              <MessageInput
                onSendMessage={handleSendMessage}
                sending={sending}
                disabled={!selectedConversationId}
              />
            )}
          </div>
        </div>
      </div>

      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        onCreateConversation={handleNewConversation}
      />
    </div>
  );
};

export default MessagingInterface;
