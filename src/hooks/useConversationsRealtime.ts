
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationsRealtime = (onConversationChanged: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isSubscribingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(async () => {
    console.log('Cleaning up conversations realtime subscription');
    
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Clean up existing channel
    if (channelRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
        console.log('Successfully removed conversations channel');
      } catch (error) {
        console.log('Error removing conversations channel:', error);
      }
      channelRef.current = null;
    }

    isSubscribedRef.current = false;
    isSubscribingRef.current = false;
  }, []);

  const setupChannel = useCallback(async () => {
    // Prevent multiple simultaneous subscription attempts
    if (isSubscribingRef.current || isSubscribedRef.current || !isMountedRef.current) {
      console.log('Skipping subscription - already subscribing or subscribed');
      return;
    }

    console.log('Setting up conversations realtime channel');
    isSubscribingRef.current = true;

    try {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMountedRef.current) {
        console.log('No session or component unmounted, skipping subscription');
        isSubscribingRef.current = false;
        return;
      }

      // Clean up any existing channel first
      await cleanup();

      if (!isMountedRef.current) {
        console.log('Component unmounted during cleanup');
        isSubscribingRef.current = false;
        return;
      }

      const channelName = `conversations-changes-${session.user.id}`;
      console.log('Creating conversations channel:', channelName);

      const channel = supabase
        .channel(channelName, {
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
          console.log('Conversations subscription status:', status);
          
          if (!isMountedRef.current) {
            console.log('Component unmounted, ignoring status update');
            return;
          }

          if (status === 'SUBSCRIBED') {
            console.log('Conversations subscription successful');
            isSubscribedRef.current = true;
            isSubscribingRef.current = false;
          } else if (status === 'CLOSED') {
            console.log('Conversations subscription closed');
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Conversations subscription failed:', status);
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
            
            // Only retry if component is still mounted and we haven't exceeded retry attempts
            if (isMountedRef.current && !retryTimeoutRef.current) {
              console.log('Scheduling retry in 10 seconds...');
              retryTimeoutRef.current = setTimeout(() => {
                retryTimeoutRef.current = null;
                if (isMountedRef.current) {
                  setupChannel();
                }
              }, 10000);
            }
          }
        });

      channelRef.current = channel;
      console.log('Conversations channel created and subscribed');

    } catch (error) {
      console.error('Error setting up conversations realtime:', error);
      isSubscribingRef.current = false;
      
      // Only retry if component is still mounted and we haven't exceeded retry attempts
      if (isMountedRef.current && !retryTimeoutRef.current) {
        console.log('Scheduling retry due to error in 15 seconds...');
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null;
          if (isMountedRef.current) {
            setupChannel();
          }
        }, 15000);
      }
    }
  }, [onConversationChanged, cleanup]);

  useEffect(() => {
    isMountedRef.current = true;
    console.log('Initializing conversations realtime subscription');
    
    setupChannel();

    return () => {
      console.log('Cleaning up conversations realtime on unmount');
      isMountedRef.current = false;
      cleanup();
    };
  }, [setupChannel, cleanup]);
};
