
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessagesRealtime = (conversationId: string | null, onMessageReceived: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isSubscribingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentConversationRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);
  const channelIdRef = useRef<string | null>(null);
  const callbackRef = useRef(onMessageReceived);

  const stableConversationId = useRef<string | null>(null);
  if (stableConversationId.current !== conversationId) {
    stableConversationId.current = conversationId;
  }

  useEffect(() => {
    callbackRef.current = onMessageReceived;
  }, [onMessageReceived]);

  const cleanup = useCallback(async () => {
    console.log('Cleaning up messages realtime subscription');
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (channelRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
        console.log('Successfully removed messages channel');
      } catch (error) {
        console.log('Error removing messages channel:', error);
      }
      channelRef.current = null;
    }

    isSubscribedRef.current = false;
    isSubscribingRef.current = false;
    channelIdRef.current = null;
  }, []);

  const setupChannel = useCallback(async (targetConversationId: string) => {
    if (
      isSubscribingRef.current || 
      (isSubscribedRef.current && currentConversationRef.current === targetConversationId) || 
      !isMountedRef.current ||
      channelIdRef.current
    ) {
      console.log('Skipping messages subscription - already subscribing/subscribed or unmounted');
      return;
    }

    if (retryCountRef.current >= 3) {
      console.log('Max retry attempts reached for messages subscription');
      return;
    }

    console.log('Setting up messages realtime channel for conversation:', targetConversationId);
    isSubscribingRef.current = true;
    currentConversationRef.current = targetConversationId;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMountedRef.current) {
        console.log('No session or component unmounted, skipping messages subscription');
        isSubscribingRef.current = false;
        return;
      }

      await cleanup();

      if (!isMountedRef.current || currentConversationRef.current !== targetConversationId) {
        console.log('Component unmounted or conversation changed during cleanup');
        isSubscribingRef.current = false;
        return;
      }

      const timestamp = Date.now();
      const channelName = `messages-${targetConversationId}-${session.user.id}-${timestamp}`;
      channelIdRef.current = channelName;
      console.log('Creating messages channel:', channelName);

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
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${targetConversationId}`
          },
          (payload) => {
            console.log('New message received:', payload);
            if (isMountedRef.current && currentConversationRef.current === targetConversationId && channelIdRef.current === channelName) {
              callbackRef.current();
            }
          }
        )
        .subscribe((status) => {
          console.log('Messages subscription status:', status);
          
          if (!isMountedRef.current || channelIdRef.current !== channelName) {
            console.log('Component unmounted or channel changed, ignoring status update');
            return;
          }

          if (status === 'SUBSCRIBED') {
            console.log('Messages subscription successful');
            isSubscribedRef.current = true;
            isSubscribingRef.current = false;
            retryCountRef.current = 0;
          } else if (status === 'CLOSED') {
            console.log('Messages subscription closed');
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Messages subscription failed:', status);
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
            
            if (isMountedRef.current && currentConversationRef.current === targetConversationId && retryCountRef.current < 3 && !retryTimeoutRef.current) {
              retryCountRef.current++;
              const retryDelay = Math.min(5000 * retryCountRef.current, 30000);
              console.log(`Scheduling messages retry ${retryCountRef.current}/3 in ${retryDelay}ms...`);
              retryTimeoutRef.current = setTimeout(() => {
                retryTimeoutRef.current = null;
                if (isMountedRef.current && currentConversationRef.current === targetConversationId) {
                  setupChannel(targetConversationId);
                }
              }, retryDelay);
            }
          }
        });

      channelRef.current = channel;
      console.log('Messages channel created and subscribed');

    } catch (error) {
      console.error('Error setting up messages realtime:', error);
      isSubscribingRef.current = false;
      
      if (isMountedRef.current && currentConversationRef.current === targetConversationId && retryCountRef.current < 3 && !retryTimeoutRef.current) {
        retryCountRef.current++;
        const retryDelay = Math.min(10000 * retryCountRef.current, 60000);
        console.log(`Scheduling messages retry ${retryCountRef.current}/3 due to error in ${retryDelay}ms...`);
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null;
          if (isMountedRef.current && currentConversationRef.current === targetConversationId) {
            setupChannel(targetConversationId);
          }
        }, retryDelay);
      }
    }
  }, [cleanup]);

  useEffect(() => {
    console.log(`Messages conversation changed to: ${conversationId}`);
    
    retryCountRef.current = 0;

    if (!conversationId) {
      console.log('No conversation selected, cleaning up messages subscription');
      currentConversationRef.current = null;
      cleanup();
      return;
    }

    if (currentConversationRef.current === conversationId) {
      console.log('Same conversation for messages, skipping setup');
      return;
    }

    const setupTimeout = setTimeout(() => {
      if (isMountedRef.current && stableConversationId.current === conversationId) {
        setupChannel(conversationId);
      }
    }, 200);
    
    return () => {
      clearTimeout(setupTimeout);
    };
  }, [conversationId]);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      console.log('Cleaning up messages realtime on unmount');
      isMountedRef.current = false;
      cleanup();
    };
  }, []);
};
