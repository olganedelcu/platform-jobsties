
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageAttachment } from '@/hooks/useMessages';

export const MessageService = {
  async fetchConversationDetails(conversationId: string) {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('coach_email')
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }

    return conversation;
  },

  async fetchMessagesData(conversationId: string) {
    const { data: messagesData, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return messagesData || [];
  },

  async fetchAttachments(messageIds: string[]) {
    if (messageIds.length === 0) return [];

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
    if (senderIds.length === 0) return [];

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .in('id', senderIds);

    if (error) {
      console.log('Error fetching profiles by ID:', error);
      return [];
    }

    return profiles || [];
  },

  getCoachProfile(coachEmail: string, profilesData: any[]) {
    let coachProfile = profilesData.find(p => p.email === coachEmail && p.role === 'COACH');
    
    if (!coachProfile && coachEmail === 'ana@jobsties.com') {
      coachProfile = {
        id: null,
        first_name: 'Ana',
        last_name: 'Nedelcu',
        email: 'ana@jobsties.com',
        role: 'COACH'
      };
    }

    return coachProfile;
  },

  formatMessages(messagesData: any[], attachmentsData: any[], profilesData: any[], coachProfile: any) {
    return messagesData.map((msg: any) => {
      let senderName = 'Unknown';
      
      if (msg.sender_type === 'coach' && coachProfile) {
        senderName = `${coachProfile.first_name} ${coachProfile.last_name}`;
      } else {
        const profile = profilesData.find(p => p.id === msg.sender_id);
        if (profile) {
          senderName = `${profile.first_name} ${profile.last_name}`;
        }
      }

      const messageAttachments = attachmentsData.filter(att => att.message_id === msg.id);

      return {
        ...msg,
        sender_name: senderName,
        attachments: messageAttachments
      };
    });
  },

  async insertMessage(conversationId: string, userId: string, senderType: 'coach' | 'mentee', content: string) {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        sender_type: senderType,
        content: content.trim(),
        message_type: 'text'
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return message;
  },

  async updateConversationTimestamp(conversationId: string) {
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  }
};
