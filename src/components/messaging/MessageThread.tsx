
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      
      <div className="flex-1 overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto p-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="space-y-1">
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              const isCoach = message.sender_type === 'coach';

              return (
                <div
                  key={message.id}
                  className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-1.5 py-1 rounded-lg break-words overflow-wrap-anywhere shadow-sm ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : isCoach
                        ? 'bg-purple-50 text-purple-900 border border-purple-200 rounded-bl-sm'
                        : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {isCoach ? (
                        <Bot className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <User className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="text-[10px] font-medium">
                        {isCurrentUser ? 'You' : message.sender_name || 'Unknown'}
                      </span>
                      {isCoach && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-purple-100 text-purple-700">
                          Coach
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere mb-1">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className={`flex items-center gap-1 p-1 rounded text-[10px] ${
                              isCurrentUser ? 'bg-blue-700' : 'bg-gray-200'
                            }`}
                          >
                            <Paperclip className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate flex-1 min-w-0">
                              {attachment.file_name}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-4 w-4 p-0 flex-shrink-0 ${
                                isCurrentUser 
                                  ? 'hover:bg-blue-800 text-blue-100' 
                                  : 'hover:bg-gray-300 text-gray-600'
                              }`}
                              onClick={() => onDownloadAttachment(attachment)}
                            >
                              <Download className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-1 text-right">
                      <span
                        className={`text-[9px] ${
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
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
