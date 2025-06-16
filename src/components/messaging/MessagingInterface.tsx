
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
    <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="lg:col-span-1 h-full">
          <ConversationsList
            conversations={conversations}
            loading={loading}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            onNewConversation={() => setShowNewConversation(true)}
            onArchiveConversation={handleArchiveConversation}
          />
        </div>

        <div className="lg:col-span-2 h-full">
          <Card className="h-full flex flex-col border-gray-200 shadow-sm">
            <div className="flex-1 min-h-0">
              <MessageThreadContainer 
                conversationId={selectedConversationId}
              />
            </div>
            {selectedConversationId && (
              <div className="flex-shrink-0 border-t border-gray-200">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  sending={sending}
                  disabled={!selectedConversationId}
                />
              </div>
            )}
          </Card>
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
