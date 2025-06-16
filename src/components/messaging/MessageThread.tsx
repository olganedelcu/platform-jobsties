
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
      <div className="h-full flex flex-col">
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex-shrink-0">
          <div className="text-gray-900 font-medium">Loading messages...</div>
        </div>
        <div className="p-6 flex-1">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex-shrink-0">
          <div className="text-gray-900 font-medium flex items-center gap-2">
            <User className="h-5 w-5" />
            {conversationSubject || 'Conversation'}
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-700 font-medium">No messages yet</p>
            <p className="text-sm text-gray-500 mt-1">Start the conversation below</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-900 font-medium">
          <User className="h-5 w-5" />
          {conversationSubject || 'Conversation'}
        </div>
      </div>
      <ScrollArea className="flex-1 h-0" ref={scrollAreaRef}>
        <div className="flex flex-col space-y-4 p-4">
          {messages.map((message) => {
            const isCurrentUser = message.sender_id === currentUserId;
            const isCoach = message.sender_type === 'coach';

            return (
              <div
                key={message.id}
                className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-lg break-words overflow-wrap-anywhere shadow-sm ${
                    isCurrentUser
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : isCoach
                      ? 'bg-purple-50 text-purple-900 border border-purple-200 rounded-bl-sm'
                      : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCoach ? (
                      <Bot className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <User className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">
                      {isCurrentUser ? 'You' : message.sender_name || 'Unknown'}
                    </span>
                    {isCoach && (
                      <Badge variant="secondary" className="text-xs px-2 py-0 bg-purple-100 text-purple-700">
                        Coach
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere mb-2">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className={`flex items-center gap-2 p-2 rounded text-sm ${
                            isCurrentUser ? 'bg-blue-700' : 'bg-gray-200'
                          }`}
                        >
                          <Paperclip className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate flex-1 min-w-0">
                            {attachment.file_name}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-6 w-6 p-0 flex-shrink-0 ${
                              isCurrentUser 
                                ? 'hover:bg-blue-800 text-blue-100' 
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
                  
                  <div className="mt-2 text-right">
                    <span
                      className={`text-xs ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
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
    </div>
  );
};

export default MessageThread;
