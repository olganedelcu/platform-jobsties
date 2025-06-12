
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
  unread_count?: number;
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

      // Format conversations with mentee names and get unread counts
      const formattedConversations = await Promise.all(
        (data || []).map(async (conv: any) => {
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

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact' })
            .eq('conversation_id', conv.id)
            .eq('read_status', false)
            .neq('sender_id', user.id);

          return {
            ...conv,
            mentee_name: menteeName,
            last_message: lastMessage?.content || '',
            unread_count: unreadCount || 0
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

  const createConversation = async (subject: string) => {
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

    // Set up real-time subscription for conversations
    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, []);

  return {
    conversations,
    loading,
    fetchConversations,
    createConversation,
    updateConversationStatus
  };
};
