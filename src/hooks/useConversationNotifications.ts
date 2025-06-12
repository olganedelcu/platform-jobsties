
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationNotifications = (conversationId: string | null) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isSubscribingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentConversationRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);
  const channelIdRef = useRef<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!conversationId || !isMountedRef.current) {
      if (isMountedRef.current) {
        setUnreadCount(0);
      }
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMountedRef.current) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread notifications:', error);
        return;
      }

      if (isMountedRef.current) {
        setUnreadCount(data?.length || 0);
      }
    } catch (error) {
      console.error('Error in fetchUnreadCount:', error);
    }
  }, [conversationId]);

  const cleanup = useCallback(async () => {
    console.log('Cleaning up notification realtime subscription');
    
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Clean up existing channel
    if (channelRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
        console.log('Successfully removed notification channel');
      } catch (error) {
        console.log('Error removing notification channel:', error);
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
      console.log('Skipping notification subscription - already subscribing/subscribed to same conversation or unmounted');
      return;
    }

    // Check retry limit
    if (retryCountRef.current >= 3) {
      console.log('Max retry attempts reached for notification subscription');
      return;
    }

    console.log('Setting up notification realtime channel for conversation:', targetConversationId);
    isSubscribingRef.current = true;
    currentConversationRef.current = targetConversationId;

    try {
      // Check authentication first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMountedRef.current) {
        console.log('No session or component unmounted, skipping notification subscription');
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
      const channelName = `conversation-notifications-${targetConversationId}-${session.user.id}-${timestamp}`;
      channelIdRef.current = channelName;
      console.log('Creating notification channel:', channelName);

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
            table: 'notifications',
            filter: `conversation_id=eq.${targetConversationId}`
          },
          (payload) => {
            console.log('Notification change detected:', payload);
            if (isMountedRef.current && currentConversationRef.current === targetConversationId && channelIdRef.current === channelName) {
              fetchUnreadCount();
            }
          }
        )
        .subscribe((status) => {
          console.log('Notification subscription status:', status);
          
          if (!isMountedRef.current || channelIdRef.current !== channelName) {
            console.log('Component unmounted or channel changed, ignoring status update');
            return;
          }

          if (status === 'SUBSCRIBED') {
            console.log('Notification subscription successful');
            isSubscribedRef.current = true;
            isSubscribingRef.current = false;
            retryCountRef.current = 0;
          } else if (status === 'CLOSED') {
            console.log('Notification subscription closed');
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Notification subscription failed:', status);
            isSubscribedRef.current = false;
            isSubscribingRef.current = false;
            
            if (isMountedRef.current && currentConversationRef.current === targetConversationId && retryCountRef.current < 3 && !retryTimeoutRef.current) {
              retryCountRef.current++;
              const retryDelay = Math.min(5000 * retryCountRef.current, 30000);
              console.log(`Scheduling notification retry ${retryCountRef.current}/3 in ${retryDelay}ms...`);
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
      console.log('Notification channel created and subscribed');

    } catch (error) {
      console.error('Error setting up notification realtime:', error);
      isSubscribingRef.current = false;
      
      if (isMountedRef.current && currentConversationRef.current === targetConversationId && retryCountRef.current < 3 && !retryTimeoutRef.current) {
        retryCountRef.current++;
        const retryDelay = Math.min(10000 * retryCountRef.current, 60000);
        console.log(`Scheduling notification retry ${retryCountRef.current}/3 due to error in ${retryDelay}ms...`);
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null;
          if (isMountedRef.current && currentConversationRef.current === targetConversationId) {
            setupChannel(targetConversationId);
          }
        }, retryDelay);
      }
    }
  }, [cleanup, fetchUnreadCount]); // Both cleanup and fetchUnreadCount are stable

  useEffect(() => {
    isMountedRef.current = true;
    retryCountRef.current = 0;

    if (!conversationId) {
      console.log('No conversation selected, cleaning up notification subscription');
      currentConversationRef.current = null;
      if (isMountedRef.current) {
        setUnreadCount(0);
      }
      cleanup();
      return;
    }

    // Fetch initial unread count
    fetchUnreadCount();

    // Only setup if we're switching to a different conversation
    if (currentConversationRef.current !== conversationId) {
      console.log('Setting up notification subscription for new conversation:', conversationId);
      // Small delay to prevent immediate conflicts
      const initTimeout = setTimeout(() => {
        if (isMountedRef.current && currentConversationRef.current === conversationId) {
          setupChannel(conversationId);
        }
      }, 150);
      
      return () => {
        clearTimeout(initTimeout);
      };
    }
  }, [conversationId, setupChannel, fetchUnreadCount]); // Both setupChannel and fetchUnreadCount are now stable

  useEffect(() => {
    return () => {
      console.log('Cleaning up notification realtime on unmount');
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return { unreadCount, refetchUnreadCount: fetchUnreadCount };
};
