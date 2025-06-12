
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationsRealtime = (onConversationChanged: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    const setupChannel = async () => {
      // Clean up any existing channel
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }

      try {
        // Check if user is authenticated before setting up realtime
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No session available for realtime subscription');
          return;
        }

        const channel = supabase
          .channel('conversations-changes', {
            config: {
              broadcast: { self: true },
              presence: { key: session.user.id }
            }
          })
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'conversations'
            },
            (payload) => {
              console.log('Conversation change detected:', payload);
              onConversationChanged();
            }
          )
          .subscribe((status) => {
            console.log('Conversation subscription status:', status);
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Conversation subscription failed:', status);
              isSubscribedRef.current = false;
              // Retry after a delay
              setTimeout(setupChannel, 3000);
            }
          });

        channelRef.current = channel;
      } catch (error) {
        console.error('Error setting up conversations realtime:', error);
        // Retry after a delay
        setTimeout(setupChannel, 5000);
      }
    };

    setupChannel();

    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [onConversationChanged]);
};
