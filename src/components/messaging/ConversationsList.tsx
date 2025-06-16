
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Plus, Archive, Clock, MoreVertical } from 'lucide-react';
import { Conversation } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onArchiveConversation: (conversationId: string) => void;
  loading: boolean;
}

const ConversationsList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  onArchiveConversation,
  loading
}: ConversationsListProps) => {
  const [activeTab, setActiveTab] = useState<string>("active");

  // Filter conversations based on status
  const activeConversations = conversations.filter(conv => conv.status !== 'archived');
  const archivedConversations = conversations.filter(conv => conv.status === 'archived');

  const renderConversationsList = (conversationsList: Conversation[], showArchiveOption: boolean = true) => {
    if (conversationsList.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            {activeTab === 'active' ? 'No active conversations yet' : 'No archived conversations'}
          </p>
          {activeTab === 'active' && (
            <p className="text-xs text-gray-400 mt-1">Start a new conversation with your coach</p>
          )}
        </div>
      );
    }

    return (
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversationsList.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                selectedConversationId === conversation.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div 
                className="flex items-start justify-between pr-8"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.subject || 'No Subject'}
                    </h4>
                    {conversation.status === 'archived' && (
                      <Archive className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    with {conversation.mentee_name || 'Coach Ana'}
                  </p>
                  {conversation.last_message && (
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.last_message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {showArchiveOption && conversation.status !== 'archived' && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchiveConversation(conversation.id);
                        }}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </CardTitle>
          <Button size="sm" onClick={onNewConversation}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mx-2 mb-2 grid w-auto grid-cols-2 flex-shrink-0">
            <TabsTrigger value="active" className="text-xs">
              Active ({activeConversations.length})
            </TabsTrigger>
            <TabsTrigger value="archive" className="text-xs">
              Archive ({archivedConversations.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="flex-1 min-h-0 mt-0">
            {renderConversationsList(activeConversations, true)}
          </TabsContent>
          
          <TabsContent value="archive" className="flex-1 min-h-0 mt-0">
            {renderConversationsList(archivedConversations, false)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
