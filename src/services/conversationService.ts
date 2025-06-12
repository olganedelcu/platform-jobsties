
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
    let query = supabase
      .from('conversations')
      .select(`
        *,
        profiles!conversations_mentee_id_fkey(first_name, last_name)
      `)
      .order('updated_at', { ascending: false });

    if (userRole === 'MENTEE') {
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
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .eq('read_status', false)
      .neq('sender_id', userId);

    return unreadCount || 0;
  },

  async formatConversations(conversationsData: any[], userId: string): Promise<Conversation[]> {
    return Promise.all(
      conversationsData.map(async (conv: any) => {
        const mentee = conv.profiles;
        const menteeName = mentee ? `${mentee.first_name} ${mentee.last_name}` : 'Unknown';

        const lastMessage = await this.getLastMessage(conv.id);
        const unreadCount = await this.getUnreadCount(conv.id, userId);

        return {
          ...conv,
          mentee_name: menteeName,
          last_message: lastMessage?.content || '',
          unread_count: unreadCount
        };
      })
    );
  },

  async createNewConversation(userId: string, subject: string) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        mentee_id: userId,
        subject,
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
