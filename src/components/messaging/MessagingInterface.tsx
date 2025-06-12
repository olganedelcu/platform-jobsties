
import React, { useState, useEffect } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { useNotifications } from '@/hooks/useNotifications';
import ConversationsList from './ConversationsList';
import MessageThread from './MessageThread';
import MessageInput from './MessageInput';
import NewConversationDialog from './NewConversationDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MessagingInterface = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const {
    conversations,
    loading: conversationsLoading,
    createConversation,
    fetchConversations
  } = useConversations();

  const {
    messages,
    loading: messagesLoading,
    sending,
    sendMessage,
    downloadAttachment
  } = useMessages(selectedConversationId);

  const { markAllAsRead, unreadCount } = useNotifications();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleCreateConversation = async (subject: string, initialMessage?: string) => {
    const newConversation = await createConversation(subject);
    if (newConversation && initialMessage) {
      setSelectedConversationId(newConversation.id);
      setTimeout(() => {
        sendMessage(initialMessage);
      }, 500);
    }
    setShowNewConversationDialog(false);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    await sendMessage(content, attachments);
    // Refresh conversations to update the last message and timestamp
    await fetchConversations();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    // Refresh conversations to update unread counts
    await fetchConversations();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-2">Communicate with your coach</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllRead}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Up To Date
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <ConversationsList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            onCreateConversation={() => setShowNewConversationDialog(true)}
            loading={conversationsLoading}
          />
        </div>

        {/* Message Thread and Input */}
        <div className="lg:col-span-2 flex flex-col">
          {selectedConversationId ? (
            <>
              <div className="flex-1">
                <MessageThread
                  messages={messages}
                  loading={messagesLoading}
                  conversationSubject={selectedConversation?.subject || null}
                  onDownloadAttachment={downloadAttachment}
                  currentUserId={currentUserId}
                />
              </div>
              <MessageInput
                onSendMessage={handleSendMessage}
                sending={sending}
              />
            </>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
                  <p className="text-sm">Choose a conversation from the list to start messaging</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <NewConversationDialog
        open={showNewConversationDialog}
        onOpenChange={setShowNewConversationDialog}
        onCreateConversation={handleCreateConversation}
      />
    </div>
  );
};

export default MessagingInterface;
