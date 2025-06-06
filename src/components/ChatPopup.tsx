
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { format } from 'date-fns';

interface ChatPopupProps {
  userId: string;
  userEmail: string;
}

const ChatPopup = ({ userId, userEmail }: ChatPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { messages, loading, sendMessage } = useChat(userId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className={`w-80 shadow-xl transition-all duration-300 ${isMinimized ? 'h-14' : 'h-96'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 bg-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <CardTitle className="text-sm font-medium">Chat with Ana</CardTitle>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={minimizeChat}
                  className="h-6 w-6 text-white hover:bg-indigo-700"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeChat}
                  className="h-6 w-6 text-white hover:bg-indigo-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="flex-1 flex flex-col p-0 h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-sm text-gray-500">Loading chat...</div>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-3">
                        {messages.length === 0 ? (
                          <div className="text-center text-gray-500 py-4">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-xs">Start a conversation with Ana!</p>
                          </div>
                        ) : (
                          messages.map((message) => {
                            const isFromUser = message.sender_id === userId;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                    isFromUser
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-xs">{message.message}</p>
                                  <p
                                    className={`text-xs mt-1 opacity-70 ${
                                      isFromUser ? 'text-indigo-200' : 'text-gray-500'
                                    }`}
                                  >
                                    {format(new Date(message.created_at), 'HH:mm')}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    <div className="border-t p-3">
                      <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 text-xs"
                        />
                        <Button 
                          type="submit" 
                          disabled={!newMessage.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700"
                          size="icon"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </form>
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
