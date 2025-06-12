
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessagesRealtime = (conversationId: string | null, onMessageReceived: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

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
      // Don't setup if already subscribed or component unmounted
      if (isSubscribedRef.current || !isMountedRef.current) {
        return;
      }

      // Clean up any existing channel first
      if (channelRef.current) {
        try {
          await supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.log('Error removing existing channel:', error);
        }
        channelRef.current = null;
        isSubscribedRef.current = false;
      }

      try {
        // Check if user is authenticated and component is still mounted
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !isMountedRef.current) {
          return;
        }

        const channel = supabase
          .channel(`messages-${conversationId}-${session.user.id}`, {
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
              if (isMountedRef.current) {
                onMessageReceived();
              }
            }
          )
          .subscribe((status) => {
            console.log('Messages subscription status:', status);
            if (!isMountedRef.current) return;
            
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Messages subscription failed:', status);
              isSubscribedRef.current = false;
              // Only retry if component is still mounted
              if (isMountedRef.current) {
                setTimeout(() => {
                  if (isMountedRef.current) {
                    setupChannel();
                  }
                }, 5000);
              }
            }
          });

        channelRef.current = channel;
      } catch (error) {
        console.error('Error setting up messages realtime:', error);
        // Only retry if component is still mounted
        if (isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current) {
              setupChannel();
            }
          }, 10000);
        }
      }
    };

    setupChannel();

    return () => {
      isMountedRef.current = false;
      if (channelRef.current && isSubscribedRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [conversationId, onMessageReceived]);
};
