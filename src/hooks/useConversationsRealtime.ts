
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationsRealtime = (onConversationChanged: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isSubscribingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const channelIdRef = useRef<string | null>(null);
  const callbackRef = useRef(onConversationChanged);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onConversationChanged;
  }, [onConversationChanged]);

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
    channelIdRef.current = null;
  }, []); // No dependencies to break circular reference

  const setupChannel = useCallback(async () => {
    // Prevent multiple simultaneous subscription attempts
    if (isSubscribingRef.current || isSubscribedRef.current || !isMountedRef.current) {
      console.log('Skipping subscription - already subscribing/subscribed or unmounted');
      return;
    }

    // Check retry limit
    if (retryCountRef.current >= 3) {
      console.log('Max retry attempts reached for conversations subscription');
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

      // Generate unique channel name with timestamp to avoid conflicts
      const timestamp = Date.now();
      const channelName = `conversations-changes-${session.user.id}-${timestamp}`;
      channelIdRef.current = channelName;
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
            if (isMountedRef.current && channelIdRef.current === channelName) {
              callbackRef.current();
            }
          }
        )
        .subscribe((status) => {
          console.log('Conversations subscription status:', status);
          
          if (!isMountedRef.current || channelIdRef.current !== channelName) {
            console.log('Component unmounted or channel changed, ignoring status update');
            return;
          }

          if (status === 'SUBSCRIBED') {
            console.log('Conversations subscription successful');
            isSubscribedRef.current = true;
            isSubscribingRef.current = false;
            retryCountRef.current = 0;
          } else if (status === 'CLOSED') {
            console.log('Conversations subscription closed');
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Conversations subscription failed:', status);
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
            
            if (isMountedRef.current && retryCountRef.current < 3 && !retryTimeoutRef.current) {
              retryCountRef.current++;
              const retryDelay = Math.min(5000 * retryCountRef.current, 30000);
              console.log(`Scheduling retry ${retryCountRef.current}/3 in ${retryDelay}ms...`);
              retryTimeoutRef.current = setTimeout(() => {
                retryTimeoutRef.current = null;
                if (isMountedRef.current) {
                  setupChannel();
                }
              }, retryDelay);
            }
          }
        });

      channelRef.current = channel;
      console.log('Conversations channel created and subscribed');

    } catch (error) {
      console.error('Error setting up conversations realtime:', error);
      isSubscribingRef.current = false;
      
      if (isMountedRef.current && retryCountRef.current < 3 && !retryTimeoutRef.current) {
        retryCountRef.current++;
        const retryDelay = Math.min(10000 * retryCountRef.current, 60000);
        console.log(`Scheduling retry ${retryCountRef.current}/3 due to error in ${retryDelay}ms...`);
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null;
          if (isMountedRef.current) {
            setupChannel();
          }
        }, retryDelay);
      }
    }
  }, [cleanup]); // Only cleanup as dependency

  useEffect(() => {
    isMountedRef.current = true;
    retryCountRef.current = 0;
    console.log('Initializing conversations realtime subscription');
    
    // Small delay to prevent immediate conflicts
    const initTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        setupChannel();
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      console.log('Cleaning up conversations realtime on unmount');
      isMountedRef.current = false;
      cleanup();
    };
  }, []); // Empty dependency array to run only once
};
