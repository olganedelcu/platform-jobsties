
import { supabase } from '@/integrations/supabase/client';

export const useConversationDataService = () => {
  const getConversationDetails = async (conversationId: string) => {
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('coach_email')
      .eq('id', conversationId)
      .single();

    if (conversationError) {
      console.error('Error fetching conversation:', conversationError);
      return null;
    }

    return conversation;
  };

  return { getConversationDetails };
};
