import { supabase } from '@/integrations/supabase/client';
import { Message, MessageAttachment } from '@/hooks/useMessages';
import { SecureErrorHandler } from '@/utils/errorHandling';

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
    
    // Filter out any undefined, null, or empty values from senderIds
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

    // Filter out any null/undefined profiles and ensure all required fields exist
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
      // Comprehensive safety checks
      if (!coachEmail || typeof coachEmail !== 'string') {
        console.log('Invalid coach email provided:', coachEmail);
        return null;
      }
      
      if (!Array.isArray(profilesData)) {
        console.log('Invalid profiles data provided:', profilesData);
        return null;
      }
      
      const safeCoachEmail = SecureErrorHandler.safeStringOperation(coachEmail, 'toLowerCase', '');
      if (!safeCoachEmail) {
        console.log('Coach email could not be processed:', coachEmail);
        return null;
      }
      
      // Filter out invalid profiles and find match with enhanced safety
      const validProfiles = profilesData.filter(profile => {
        return profile && 
               typeof profile === 'object' && 
               profile.email && 
               typeof profile.email === 'string';
      });
      
      console.log('Searching for coach profile with email:', safeCoachEmail);
      console.log('Valid profiles count:', validProfiles.length);
      
      const foundProfile = validProfiles.find(profile => {
        try {
          const profileEmail = SecureErrorHandler.safeStringOperation(profile.email, 'toLowerCase', '');
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
      
      // Filter out invalid messages
      const validMessages = messagesData.filter(message => {
        return message && typeof message === 'object' && message.id;
      });
      
      return validMessages.map((message, index) => {
        try {
          // Safely handle sender information
          const senderId = message?.sender_id;
          let senderName = 'Unknown';
          let senderType: 'coach' | 'mentee' = 'mentee';

          if (senderId) {
            const senderProfile = Array.isArray(profilesData) 
              ? profilesData.find(p => p && p.id === senderId) 
              : null;
            
            if (senderProfile) {
              const firstName = SecureErrorHandler.safeStringOperation(senderProfile.first_name, 'trim', '');
              const lastName = SecureErrorHandler.safeStringOperation(senderProfile.last_name, 'trim', '');
              senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Unknown';
            } else if (coachProfile && coachProfile.id === senderId) {
              const firstName = SecureErrorHandler.safeStringOperation(coachProfile.first_name, 'trim', '');
              const lastName = SecureErrorHandler.safeStringOperation(coachProfile.last_name, 'trim', '');
              senderName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Coach';
              senderType = 'coach';
            }
          }

          // Keep sender type check in uppercase to match database format
          const rawSenderType = SecureErrorHandler.safeStringOperation(message?.sender_type, 'toUpperCase', '');
          if (rawSenderType === 'COACH') {
            senderType = 'coach';
          }

          // Safely handle attachments
          const messageAttachments = Array.isArray(attachmentsData)
            ? attachmentsData.filter(att => att && att.message_id === message?.id)
            : [];

          return {
            id: SecureErrorHandler.safeStringOperation(message?.id, 'trim', ''),
            conversation_id: SecureErrorHandler.safeStringOperation(message?.conversation_id, 'trim', ''),
            sender_id: senderId || null,
            sender_type: senderType,
            sender_name: senderName,
            content: SecureErrorHandler.safeStringOperation(message?.content, 'trim', ''),
            message_type: SecureErrorHandler.safeStringOperation(message?.message_type, 'trim', 'text'),
            read_status: Boolean(message?.read_status),
            read_at: message?.read_at || null,
            created_at: SecureErrorHandler.safeStringOperation(message?.created_at, 'trim', new Date().toISOString()),
            updated_at: SecureErrorHandler.safeStringOperation(message?.updated_at, 'trim', new Date().toISOString()),
            attachments: messageAttachments.map((att: any) => ({
              id: SecureErrorHandler.safeStringOperation(att?.id, 'trim', ''),
              message_id: SecureErrorHandler.safeStringOperation(att?.message_id, 'trim', ''),
              file_name: SecureErrorHandler.safeStringOperation(att?.file_name, 'trim', 'Unknown File'),
              file_size: Number(att?.file_size) || 0,
              file_type: SecureErrorHandler.safeStringOperation(att?.file_type, 'trim', 'unknown'),
              file_url: SecureErrorHandler.safeStringOperation(att?.file_path, 'trim', '')
            }))
          };
        } catch (error) {
          console.error(`Error formatting message ${index}:`, error, message);
          // Return a safe fallback message
          return {
            id: SecureErrorHandler.safeStringOperation(message?.id, 'trim', Math.random().toString()),
            conversation_id: SecureErrorHandler.safeStringOperation(message?.conversation_id, 'trim', ''),
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

    // Keep role comparison in uppercase and store in database format
    const senderType = SecureErrorHandler.safeStringOperation(profile?.role, 'toUpperCase', '') === 'COACH' ? 'COACH' : 'MENTEE';

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: senderType,
        content: SecureErrorHandler.safeStringOperation(content, 'trim', ''),
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
