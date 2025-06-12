
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/hooks/useConversations';

export const ConversationService = {
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return { user, profile };
  },

  async fetchConversationsData(userId: string, userRole: string) {
    // Ensure userRole is a valid string
    const safeUserRole = (userRole || '').toLowerCase();
    const safeMenteeRole = 'mentee';
    
    let query = supabase
      .from('conversations')
      .select(`
        *,
        profiles!conversations_mentee_id_fkey(first_name, last_name)
      `)
      .order('updated_at', { ascending: false });

    if (safeUserRole === safeMenteeRole) {
      query = query.eq('mentee_id', userId);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    return data || [];
  },

  async getLastMessage(conversationId: string) {
    if (!conversationId) return null;
    
    const { data: lastMessage } = await supabase
      .from('messages')
      .select('content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return lastMessage;
  },

  async getUnreadCount(conversationId: string, userId: string) {
    if (!conversationId || !userId) return 0;
    
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .eq('read_status', false)
      .neq('sender_id', userId);

    return unreadCount || 0;
  },

  async formatConversations(conversationsData: any[], userId: string): Promise<Conversation[]> {
    if (!Array.isArray(conversationsData) || !userId) {
      return [];
    }

    return Promise.all(
      conversationsData.map(async (conv: any) => {
        // Safely handle profile data with null checks
        const mentee = conv?.profiles;
        const firstName = (mentee?.first_name || '').toString();
        const lastName = (mentee?.last_name || '').toString();
        const menteeName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';

        // Safely handle conversation data
        const conversationId = conv?.id;
        const lastMessage = conversationId ? await this.getLastMessage(conversationId) : null;
        const unreadCount = conversationId ? await this.getUnreadCount(conversationId, userId) : 0;

        return {
          ...conv,
          mentee_name: menteeName,
          last_message: (lastMessage?.content || '').toString(),
          unread_count: unreadCount
        };
      })
    );
  },

  async createNewConversation(userId: string, subject: string) {
    // Validate inputs
    if (!userId || !subject) {
      throw new Error('User ID and subject are required');
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        mentee_id: userId,
        subject: subject.toString(),
        coach_email: 'ana@jobsties.com'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }

    return data;
  },

  async updateConversationStatus(conversationId: string, status: 'active' | 'archived' | 'closed') {
    if (!conversationId || !status) {
      throw new Error('Conversation ID and status are required');
    }

    const { error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation status:', error);
      throw error;
    }
  }
};
