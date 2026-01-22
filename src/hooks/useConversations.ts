import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  mentee_id: string;
  coach_email: string;
  subject: string | null;
  status: 'active' | 'archived' | 'closed';
  created_at: string;
  updated_at: string;
  mentee_name?: string;
  last_message?: string;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      let query = supabase
        .from('conversations')
        .select(`
          *,
          profiles!conversations_mentee_id_fkey(first_name, last_name)
        `)
        .order('updated_at', { ascending: false });

      // If mentee, only show their conversations
      if (profile?.role === 'MENTEE') {
        query = query.eq('mentee_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations.",
          variant: "destructive"
        });
        return;
      }

      interface ProfileData {
        first_name: string;
        last_name: string;
      }

      interface RawConversation {
        id: string;
        mentee_id: string;
        coach_email: string;
        subject: string;
        status: string;
        created_at: string;
        updated_at: string;
        profiles: ProfileData;
      }

      // Format conversations with mentee names and get last message
      const formattedConversations = await Promise.all(
        (data || []).map(async (conv: RawConversation) => {
          const mentee = conv.profiles;
          const menteeName = mentee ? `${mentee.first_name} ${mentee.last_name}` : 'Unknown';

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            id: conv.id,
            mentee_id: conv.mentee_id,
            coach_email: conv.coach_email,
            subject: conv.subject,
            status: conv.status as 'active' | 'archived' | 'closed',
            created_at: conv.created_at,
            updated_at: conv.updated_at,
            mentee_name: menteeName,
            last_message: lastMessage?.content || ''
          };
        })
      );

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (subject: string, initialMessage?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          mentee_id: user.id,
          subject,
          coach_email: 'ana@jobsties.com'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Error",
          description: "Failed to create conversation.",
          variant: "destructive"
        });
        return null;
      }

      // If there's an initial message, send it
      if (initialMessage && data) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            conversation_id: data.id,
            sender_id: user.id,
            sender_type: 'mentee',
            content: initialMessage,
            message_type: 'text'
          });

        if (messageError) {
          console.error('Error sending initial message:', messageError);
        }
      }

      toast({
        title: "Success",
        description: "Conversation created successfully.",
      });

      await fetchConversations();
      return data;
    } catch (error) {
      console.error('Error in createConversation:', error);
      return null;
    }
  };

  const updateConversationStatus = async (conversationId: string, status: 'active' | 'archived' | 'closed') => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation status:', error);
        toast({
          title: "Error",
          description: "Failed to update conversation status.",
          variant: "destructive"
        });
        return;
      }

      await fetchConversations();
      toast({
        title: "Success",
        description: "Conversation status updated.",
      });
    } catch (error) {
      console.error('Error in updateConversationStatus:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation,
    updateConversationStatus
  };
};
