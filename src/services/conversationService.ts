import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/hooks/useConversations';
import { SecureErrorHandler } from '@/utils/errorHandling';

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
    console.log('fetchConversationsData called with:', { userId, userRole });
    
    // Keep role in uppercase format to match database
    const safeUserRole = SecureErrorHandler.safeStringOperation(userRole, 'toUpperCase', 'MENTEE');
    const safeMenteeRole = 'MENTEE'; // Database uses uppercase
    
    console.log('Safe user role:', safeUserRole);
    
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

    console.log('Raw conversations data:', data);
    return SecureErrorHandler.safeArrayOperation(data, []);
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
    console.log('formatConversations called with:', { conversationsDataLength: conversationsData?.length, userId });
    
    const safeConversationsData = SecureErrorHandler.safeArrayWithValidation(
      conversationsData, 
      (conv) => conv && typeof conv === 'object' && conv.id,
      []
    );
    
    if (!userId || safeConversationsData.length === 0) {
      return [];
    }

    return Promise.all(
      safeConversationsData.map(async (conv: any, index: number) => {
        try {
          console.log(`Processing conversation ${index}:`, conv);
          
          // Safely handle profile data with comprehensive null checks
          const mentee = conv?.profiles;
          console.log('Mentee profile:', mentee);
          
          // Add extra safety checks and logging
          let firstName = '';
          let lastName = '';
          
          if (mentee && typeof mentee === 'object') {
            firstName = SecureErrorHandler.safeStringOperation(mentee.first_name, 'trim', '');
            lastName = SecureErrorHandler.safeStringOperation(mentee.last_name, 'trim', '');
          }
          
          console.log(`Names extracted - firstName: "${firstName}", lastName: "${lastName}"`);
          const menteeName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';

          // Safely handle conversation data
          const conversationId = conv?.id;
          const lastMessage = conversationId ? await this.getLastMessage(conversationId) : null;
          const unreadCount = conversationId ? await this.getUnreadCount(conversationId, userId) : 0;

          const formattedConv = {
            ...conv,
            mentee_name: menteeName,
            last_message: SecureErrorHandler.safeStringOperation(lastMessage?.content, 'trim', ''),
            unread_count: unreadCount
          };
          
          console.log(`Formatted conversation ${index}:`, formattedConv);
          return formattedConv;
        } catch (error) {
          console.error(`Error formatting conversation ${index}:`, error, conv);
          // Return a safe fallback conversation
          return {
            id: conv?.id || '',
            mentee_id: conv?.mentee_id || '',
            coach_email: conv?.coach_email || 'ana@jobsties.com',
            subject: conv?.subject || 'Untitled Conversation',
            status: conv?.status || 'active',
            created_at: conv?.created_at || new Date().toISOString(),
            updated_at: conv?.updated_at || new Date().toISOString(),
            mentee_name: 'Unknown',
            last_message: '',
            unread_count: 0
          };
        }
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
        subject: SecureErrorHandler.safeStringOperation(subject, 'trim', 'Untitled Conversation'),
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
