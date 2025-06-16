
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Mail, Clock } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import { format } from 'date-fns';

const MessageCoachCard = () => {
  const navigate = useNavigate();
  const { conversations, loading } = useConversations();

  const handleMessageCoach = () => {
    navigate('/messages');
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages?conversation=${conversationId}`);
  };

  // Get recent conversations (last 3)
  const recentConversations = conversations.slice(0, 3);

  return (
    <Card className="border border-gray-200 shadow-sm h-80">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-600" />
            Coach Messages
          </h3>
          <MessageCircle className="h-4 w-4 text-indigo-600" />
        </div>

        {!loading && recentConversations.length > 0 ? (
          <>
            <ScrollArea className="h-52">
              <div className="space-y-1.5 pr-2">
                {recentConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className="p-2 bg-indigo-50 rounded-md border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {conversation.subject || 'General Discussion'}
                    </div>
                    {conversation.last_message && (
                      <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {conversation.last_message.length > 60 
                          ? `${conversation.last_message.substring(0, 60)}...` 
                          : conversation.last_message
                        }
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="h-2 w-2 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {format(new Date(conversation.updated_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-2 pt-1 border-t border-gray-200 pb-0">
              <Button 
                onClick={handleMessageCoach}
                variant="ghost"
                size="sm"
                className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-sm h-7"
              >
                All Messages
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-gray-600 mb-1 text-sm">No conversations yet</div>
            <div className="text-xs text-gray-500 mb-2">Start a conversation with your coach</div>
            <Button 
              onClick={handleMessageCoach}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-7"
            >
              Send Message
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageCoachCard;
