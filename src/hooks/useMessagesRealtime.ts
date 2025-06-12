
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessagesRealtime = (conversationId: string | null, onMessageReceived: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!conversationId) {
      // Clean up if no conversation selected
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
      return;
    }

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
          console.log('No session available for messages realtime subscription');
          return;
        }

        const channel = supabase
          .channel(`messages-${conversationId}`, {
            config: {
              broadcast: { self: true },
              presence: { key: session.user.id }
            }
          })
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
              console.log('New message received:', payload);
              onMessageReceived();
            }
          )
          .subscribe((status) => {
            console.log('Messages subscription status:', status);
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Messages subscription failed:', status);
              isSubscribedRef.current = false;
              // Retry after a delay
              setTimeout(setupChannel, 3000);
            }
          });

        channelRef.current = channel;
      } catch (error) {
        console.error('Error setting up messages realtime:', error);
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
  }, [conversationId, onMessageReceived]);
};
