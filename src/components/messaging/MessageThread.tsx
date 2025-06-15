
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Paperclip, User, Bot } from 'lucide-react';
import { Message, MessageAttachment } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';

interface MessageThreadProps {
  messages: Message[];
  loading: boolean;
  conversationSubject: string | null;
  onDownloadAttachment: (attachment: MessageAttachment) => void;
  currentUserId: string | null;
}

const MessageThread = ({
  messages,
  loading,
  conversationSubject,
  onDownloadAttachment,
  currentUserId
}: MessageThreadProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    scrollToBottom();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-[700px] border-indigo-200 flex flex-col">
        <CardHeader className="bg-indigo-50 border-b border-indigo-100 flex-shrink-0">
          <CardTitle className="text-indigo-900">Loading messages...</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-indigo-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="w-full h-[700px] border-indigo-200 flex flex-col">
        <CardHeader className="bg-indigo-50 border-b border-indigo-100 flex-shrink-0">
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <User className="h-5 w-5" />
            {conversationSubject || 'Conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-1">
          <div className="text-center text-indigo-600">
            <User className="h-12 w-12 mx-auto mb-3 text-indigo-400" />
            <p className="text-indigo-700 font-medium">No messages yet</p>
            <p className="text-sm text-indigo-500 mt-1">Start the conversation below</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[700px] flex flex-col border-indigo-200 overflow-hidden">
      <CardHeader className="flex-shrink-0 bg-indigo-50 border-b border-indigo-100">
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <User className="h-5 w-5" />
          {conversationSubject || 'Conversation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <div className="flex flex-col space-y-3 p-3">
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              const isCoach = message.sender_type === 'coach';

              return (
                <div
                  key={message.id}
                  className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] sm:max-w-[80%] px-3 py-2 rounded-lg break-words overflow-wrap-anywhere ${
                      isCurrentUser
                        ? 'bg-indigo-600 text-white'
                        : isCoach
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isCoach ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium">
                        {isCurrentUser ? 'You' : message.sender_name || 'Unknown'}
                      </span>
                      {isCoach && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-purple-200 text-purple-800">
                          Coach
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className={`flex items-center gap-2 p-2 rounded ${
                              isCurrentUser ? 'bg-indigo-700' : 'bg-gray-200'
                            }`}
                          >
                            <Paperclip className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs truncate flex-1 min-w-0">
                              {attachment.file_name}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-6 w-6 p-0 flex-shrink-0 ${
                                isCurrentUser 
                                  ? 'hover:bg-indigo-800 text-indigo-100' 
                                  : 'hover:bg-gray-300 text-gray-600'
                              }`}
                              onClick={() => onDownloadAttachment(attachment)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-1">
                      <span
                        className={`text-xs ${
                          isCurrentUser ? 'text-indigo-100' : 'text-gray-500'
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Scroll target element */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MessageThread;
