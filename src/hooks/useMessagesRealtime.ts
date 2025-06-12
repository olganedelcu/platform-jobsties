
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessagesRealtime = (conversationId: string | null, onMessageReceived: () => void) => {
  useEffect(() => {
    if (conversationId) {
      const messagesChannel = supabase
        .channel(`messages-${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          () => {
            onMessageReceived();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [conversationId, onMessageReceived]);
};
