
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationsRealtime = (onConversationChanged: () => void) => {
  useEffect(() => {
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
          onConversationChanged();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [onConversationChanged]);
};
