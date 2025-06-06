
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Conversation {
  mentee_id: string;
  mentee_name: string;
  mentee_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface CoachChatListProps {
  coachId: string;
}

const CoachChatList = ({ coachId }: CoachChatListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Get all unique conversations with this coach
        const { data: messages, error } = await supabase
          .from('chat_messages')
          .select(`
            sender_id,
            receiver_id,
            message,
            created_at
          `)
          .or(`sender_id.eq.${coachId},receiver_id.eq.${coachId}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching conversations:', error);
          return;
        }

        // Group messages by mentee and get profile information
        const menteeIds = new Set<string>();
        messages?.forEach(msg => {
          const menteeId = msg.sender_id === coachId ? msg.receiver_id : msg.sender_id;
          menteeIds.add(menteeId);
        });

        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', Array.from(menteeIds));

        if (profileError) {
          console.error('Error fetching profiles:', profileError);
          return;
        }

        // Create conversation list
        const conversationMap = new Map<string, Conversation>();
        
        profiles?.forEach(profile => {
          const menteeMessages = messages.filter(msg => 
            msg.sender_id === profile.id || msg.receiver_id === profile.id
          );
          
          if (menteeMessages.length > 0) {
            const lastMessage = menteeMessages[0];
            conversationMap.set(profile.id, {
              mentee_id: profile.id,
              mentee_name: `${profile.first_name} ${profile.last_name}`,
              mentee_email: profile.email,
              last_message: lastMessage.message,
              last_message_time: lastMessage.created_at,
              unread_count: 0 // We can implement this later if needed
            });
          }
        });

        setConversations(Array.from(conversationMap.values()));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [coachId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading conversations...</div>
      </div>
    );
  }

  if (selectedConversation) {
    const conversation = conversations.find(c => c.mentee_id === selectedConversation);
    return (
      <div>
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedConversation(null)}
            className="mb-4"
          >
            ← Back to Conversations
          </Button>
          <h2 className="text-xl font-semibold">
            Chat with {conversation?.mentee_name}
          </h2>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chat feature coming soon</h3>
            <p className="text-gray-500">Direct messaging functionality will be available soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Chat Conversations</h2>
      
      {conversations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-500">Mentees will appear here when they start chatting with you.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Card 
              key={conversation.mentee_id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedConversation(conversation.mentee_id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.mentee_name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(conversation.last_message_time).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conversation.last_message}
                    </p>
                  </div>
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachChatList;
