
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageAttachment } from '@/hooks/useMessages';

export const MessageService = {
  async fetchConversationDetails(conversationId: string) {
    if (!conversationId) return null;
    
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Error fetching conversation details:', error);
      return null;
    }

    return conversation;
  },

  async fetchMessagesData(conversationId: string) {
    if (!conversationId) return [];
    
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return messages || [];
  },

  async fetchAttachments(messageIds: string[]) {
    if (!Array.isArray(messageIds) || messageIds.length === 0) return [];
    
    const { data: attachments, error } = await supabase
      .from('message_attachments')
      .select('*')
      .in('message_id', messageIds);

    if (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }

    return attachments || [];
  },

  async fetchProfiles(senderIds: string[]) {
    if (!Array.isArray(senderIds) || senderIds.length === 0) return [];
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', senderIds);

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    return profiles || [];
  },

  getCoachProfile(coachEmail: string, profilesData: any[]) {
    if (!coachEmail || !Array.isArray(profilesData)) return null;
    
    const safeCoachEmail = (coachEmail || '').toString().toLowerCase();
    return profilesData.find(profile => {
      const profileEmail = (profile?.email || '').toString().toLowerCase();
      return profileEmail === safeCoachEmail;
    }) || null;
  },

  formatMessages(messagesData: any[], attachmentsData: any[], profilesData: any[], coachProfile: any): Message[] {
    if (!Array.isArray(messagesData)) return [];
    
    return messagesData.map(message => {
      try {
        // Safely handle sender information
        const senderId = message?.sender_id;
        let senderName = 'Unknown';
        let senderType: 'coach' | 'mentee' = 'mentee';

        if (senderId) {
          const senderProfile = Array.isArray(profilesData) 
            ? profilesData.find(p => p?.id === senderId) 
            : null;
          
          if (senderProfile) {
            const firstName = (senderProfile.first_name || '').toString();
            const lastName = (senderProfile.last_name || '').toString();
            senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';
          } else if (coachProfile && coachProfile.id === senderId) {
            const firstName = (coachProfile.first_name || '').toString();
            const lastName = (coachProfile.last_name || '').toString();
            senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Coach';
            senderType = 'coach';
          }
        }

        // Safely handle message type
        const rawSenderType = (message?.sender_type || '').toString().toLowerCase();
        if (rawSenderType === 'coach') {
          senderType = 'coach';
        }

        // Safely handle attachments
        const messageAttachments = Array.isArray(attachmentsData)
          ? attachmentsData.filter(att => att?.message_id === message?.id)
          : [];

        return {
          id: (message?.id || '').toString(),
          conversation_id: (message?.conversation_id || '').toString(),
          sender_id: senderId || null,
          sender_type: senderType,
          sender_name: senderName,
          content: (message?.content || '').toString(),
          message_type: (message?.message_type || 'text').toString(),
          read_status: Boolean(message?.read_status),
          read_at: message?.read_at || null,
          created_at: (message?.created_at || new Date().toISOString()).toString(),
          updated_at: (message?.updated_at || new Date().toISOString()).toString(),
          attachments: messageAttachments.map((att: any) => ({
            id: (att?.id || '').toString(),
            message_id: (att?.message_id || '').toString(),
            file_name: (att?.file_name || 'Unknown File').toString(),
            file_size: Number(att?.file_size) || 0,
            file_type: (att?.file_type || 'unknown').toString(),
            file_url: (att?.file_path || '').toString()
          }))
        };
      } catch (error) {
        console.error('Error formatting message:', error, message);
        // Return a safe fallback message
        return {
          id: (message?.id || Math.random().toString()).toString(),
          conversation_id: (message?.conversation_id || '').toString(),
          sender_id: null,
          sender_type: 'mentee' as const,
          sender_name: 'Unknown',
          content: 'Error loading message',
          message_type: 'text',
          read_status: false,
          read_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          attachments: []
        };
      }
    });
  },

  async insertMessage(conversationId: string, senderId: string, senderType: string, content: string) {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_type: senderType,
        content: content,
        message_type: 'text'
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting message:', error);
      throw error;
    }

    return message;
  },

  async updateConversationTimestamp(conversationId: string) {
    const { error } = await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation timestamp:', error);
      throw error;
    }
  },

  async sendMessage(conversationId: string, content: string, attachments: File[] = []) {
    if (!conversationId || !content) {
      throw new Error('Conversation ID and content are required');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const senderType = (profile?.role || '').toString().toLowerCase() === 'coach' ? 'coach' : 'mentee';

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: senderType,
        content: content.toString(),
        message_type: 'text'
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // Handle attachments if provided
    if (Array.isArray(attachments) && attachments.length > 0) {
      // Process attachments (implementation would depend on your file upload strategy)
      console.log('Processing attachments:', attachments.length);
    }

    return message;
  }
};
