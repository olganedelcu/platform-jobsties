
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationsRealtime = (onConversationChanged: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
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
          .channel(`conversations-changes-${session.user.id}`, {
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
              if (isMountedRef.current) {
                onConversationChanged();
              }
            }
          )
          .subscribe((status) => {
            console.log('Conversation subscription status:', status);
            if (!isMountedRef.current) return;
            
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Conversation subscription failed:', status);
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
        console.error('Error setting up conversations realtime:', error);
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
  }, [onConversationChanged]);
};
