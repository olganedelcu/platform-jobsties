
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

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onMessageReceived;
  }, [onMessageReceived]);

  const cleanup = useCallback(async () => {
    console.log('Cleaning up messages realtime subscription');
    
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Clean up existing channel
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
  }, []); // No dependencies to break circular reference

  const setupChannel = useCallback(async (targetConversationId: string) => {
    // Prevent multiple simultaneous subscription attempts
    if (isSubscribingRef.current || (isSubscribedRef.current && currentConversationRef.current === targetConversationId) || !isMountedRef.current) {
      console.log('Skipping messages subscription - already subscribing/subscribed to same conversation or unmounted');
      return;
    }

    // Check retry limit
    if (retryCountRef.current >= 3) {
      console.log('Max retry attempts reached for messages subscription');
      return;
    }

    console.log('Setting up messages realtime channel for conversation:', targetConversationId);
    isSubscribingRef.current = true;
    currentConversationRef.current = targetConversationId;

    try {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMountedRef.current) {
        console.log('No session or component unmounted, skipping messages subscription');
        isSubscribingRef.current = false;
        return;
      }

      // Clean up any existing channel first
      await cleanup();

      if (!isMountedRef.current || currentConversationRef.current !== targetConversationId) {
        console.log('Component unmounted or conversation changed during cleanup');
        isSubscribingRef.current = false;
        return;
      }

      // Generate unique channel name with timestamp to avoid conflicts
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
  }, [cleanup]); // Only cleanup as dependency

  useEffect(() => {
    isMountedRef.current = true;
    retryCountRef.current = 0;

    if (!conversationId) {
      console.log('No conversation selected, cleaning up messages subscription');
      currentConversationRef.current = null;
      cleanup();
      return;
    }

    // Only setup if we're switching to a different conversation
    if (currentConversationRef.current !== conversationId) {
      console.log('Setting up messages subscription for new conversation:', conversationId);
      // Small delay to prevent immediate conflicts
      const initTimeout = setTimeout(() => {
        if (isMountedRef.current && currentConversationRef.current === conversationId) {
          setupChannel(conversationId);
        }
      }, 100);
      
      return () => {
        clearTimeout(initTimeout);
      };
    }
  }, [conversationId, setupChannel]); // setupChannel is now stable

  useEffect(() => {
    return () => {
      console.log('Cleaning up messages realtime on unmount');
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);
};
