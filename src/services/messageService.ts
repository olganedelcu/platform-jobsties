
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/hooks/useMessages';

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
    
    const validSenderIds = senderIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
    
    if (validSenderIds.length === 0) return [];
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .in('id', validSenderIds);

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    const validProfiles = (profiles || []).filter(profile => {
      return profile && 
             typeof profile === 'object' && 
             profile.id && 
             typeof profile.email === 'string';
    });

    return validProfiles;
  },

  getCoachProfile(coachEmail: string, profilesData: any[]) {
    try {
      if (!coachEmail || typeof coachEmail !== 'string') {
        console.log('Invalid coach email provided:', coachEmail);
        return null;
      }
      
      if (!Array.isArray(profilesData)) {
        console.log('Invalid profiles data provided:', profilesData);
        return null;
      }
      
      const safeCoachEmail = coachEmail.toLowerCase().trim();
      if (!safeCoachEmail) {
        console.log('Coach email could not be processed:', coachEmail);
        return null;
      }
      
      const validProfiles = profilesData.filter(profile => {
        return profile && 
               typeof profile === 'object' && 
               profile.email && 
               typeof profile.email === 'string' &&
               profile.email.trim() !== '';
      });
      
      console.log('Searching for coach profile with email:', safeCoachEmail);
      console.log('Valid profiles count:', validProfiles.length);
      
      const foundProfile = validProfiles.find(profile => {
        try {
          const profileEmail = profile.email?.toLowerCase()?.trim();
          if (!profileEmail) return false;
          console.log('Comparing:', profileEmail, 'with', safeCoachEmail);
          return profileEmail === safeCoachEmail;
        } catch (error) {
          console.warn('Error processing profile email:', error, profile);
          return false;
        }
      });
      
      console.log('Found coach profile:', foundProfile);
      return foundProfile || null;
    } catch (error) {
      console.error('Error in getCoachProfile:', error);
      return null;
    }
  },

  formatMessages(messagesData: any[], attachmentsData: any[], profilesData: any[], coachProfile: any): Message[] {
    try {
      if (!Array.isArray(messagesData)) {
        console.log('Invalid messages data provided');
        return [];
      }
      
      const validMessages = messagesData.filter(message => {
        return message && typeof message === 'object' && message.id;
      });
      
      return validMessages.map((message, index) => {
        try {
          const senderId = message?.sender_id;
          let senderName = 'Unknown';
          let senderType: 'coach' | 'mentee' = 'mentee';

          if (senderId) {
            const senderProfile = Array.isArray(profilesData) 
              ? profilesData.find(p => p && p.id === senderId) 
              : null;
            
            if (senderProfile) {
              const firstName = senderProfile.first_name?.trim() || '';
              const lastName = senderProfile.last_name?.trim() || '';
              senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';
            } else if (coachProfile && coachProfile.id === senderId) {
              const firstName = coachProfile.first_name?.trim() || '';
              const lastName = coachProfile.last_name?.trim() || '';
              senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Coach';
              senderType = 'coach';
            }
          }

          const rawSenderType = message?.sender_type;
          if (rawSenderType && typeof rawSenderType === 'string' && rawSenderType.toUpperCase() === 'COACH') {
            senderType = 'coach';
          }

          const messageAttachments = Array.isArray(attachmentsData)
            ? attachmentsData.filter(att => att && att.message_id === message?.id)
            : [];

          return {
            id: message?.id?.toString() || '',
            conversation_id: message?.conversation_id?.toString() || '',
            sender_id: senderId || null,
            sender_type: senderType,
            sender_name: senderName,
            content: message?.content?.trim() || '',
            message_type: message?.message_type?.trim() || 'text',
            read_status: Boolean(message?.read_status),
            read_at: message?.read_at || null,
            created_at: message?.created_at?.toString() || new Date().toISOString(),
            updated_at: message?.updated_at?.toString() || new Date().toISOString(),
            attachments: messageAttachments.map((att: any) => ({
              id: att?.id?.toString() || '',
              message_id: att?.message_id?.toString() || '',
              file_name: att?.file_name?.trim() || 'Unknown File',
              file_size: Number(att?.file_size) || 0,
              file_type: att?.file_type?.trim() || 'unknown',
              file_url: att?.file_path?.trim() || ''
            }))
          };
        } catch (error) {
          console.error(`Error formatting message ${index}:`, error, message);
          return {
            id: message?.id?.toString() || Math.random().toString(),
            conversation_id: message?.conversation_id?.toString() || '',
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
    } catch (error) {
      console.error('Error in formatMessages:', error);
      return [];
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

    const senderType = profile?.role === 'COACH' ? 'COACH' : 'MENTEE';

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
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

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return message;
  }
};
