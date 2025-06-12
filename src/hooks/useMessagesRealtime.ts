
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMessagesRealtime = (conversationId: string | null, onMessageReceived: () => void) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isSubscribingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentConversationRef = useRef<string | null>(null);

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
  }, []);

  const setupChannel = useCallback(async (targetConversationId: string) => {
    // Prevent multiple simultaneous subscription attempts
    if (isSubscribingRef.current || (isSubscribedRef.current && currentConversationRef.current === targetConversationId) || !isMountedRef.current) {
      console.log('Skipping messages subscription - already subscribing or subscribed to same conversation');
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

      if (!isMountedRef.current) {
        console.log('Component unmounted during cleanup');
        isSubscribingRef.current = false;
        return;
      }

      const channelName = `messages-${targetConversationId}-${session.user.id}`;
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
            if (isMountedRef.current && currentConversationRef.current === targetConversationId) {
              onMessageReceived();
            }
          }
        )
        .subscribe((status) => {
          console.log('Messages subscription status:', status);
          
          if (!isMountedRef.current) {
            console.log('Component unmounted, ignoring status update');
            return;
          }

          if (status === 'SUBSCRIBED') {
            console.log('Messages subscription successful');
            isSubscribedRef.current = true;
            isSubscribingRef.current = false;
          } else if (status === 'CLOSED') {
            console.log('Messages subscription closed');
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Messages subscription failed:', status);
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
            
            // Only retry if component is still mounted and we're still targeting the same conversation
            if (isMountedRef.current && currentConversationRef.current === targetConversationId && !retryTimeoutRef.current) {
              console.log('Scheduling messages retry in 10 seconds...');
              retryTimeoutRef.current = setTimeout(() => {
                retryTimeoutRef.current = null;
                if (isMountedRef.current && currentConversationRef.current === targetConversationId) {
                  setupChannel(targetConversationId);
                }
              }, 10000);
            }
          }
        });

      channelRef.current = channel;
      console.log('Messages channel created and subscribed');

    } catch (error) {
      console.error('Error setting up messages realtime:', error);
      isSubscribingRef.current = false;
      
      // Only retry if component is still mounted and we're still targeting the same conversation
      if (isMountedRef.current && currentConversationRef.current === targetConversationId && !retryTimeoutRef.current) {
        console.log('Scheduling messages retry due to error in 15 seconds...');
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null;
          if (isMountedRef.current && currentConversationRef.current === targetConversationId) {
            setupChannel(targetConversationId);
          }
        }, 15000);
      }
    }
  }, [onMessageReceived, cleanup]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!conversationId) {
      console.log('No conversation selected, cleaning up messages subscription');
      currentConversationRef.current = null;
      cleanup();
      return;
    }

    // Only setup if we're switching to a different conversation
    if (currentConversationRef.current !== conversationId) {
      console.log('Setting up messages subscription for new conversation:', conversationId);
      setupChannel(conversationId);
    }

    return () => {
      console.log('Cleaning up messages realtime on unmount');
      isMountedRef.current = false;
      cleanup();
    };
  }, [conversationId, setupChannel, cleanup]);
};
