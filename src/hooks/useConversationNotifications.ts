
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationNotifications = (conversationId: string | null) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const isMountedRef = useRef(true);

  const fetchUnreadCount = async () => {
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
  };

  useEffect(() => {
    isMountedRef.current = true;

    if (!conversationId) {
      if (isMountedRef.current) {
        setUnreadCount(0);
      }
      // Clean up channel if no conversation
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
      return;
    }

    fetchUnreadCount();

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
          .channel(`conversation-notifications-${conversationId}-${session.user.id}`, {
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
              filter: `conversation_id=eq.${conversationId}`
            },
            (payload) => {
              console.log('Notification change detected:', payload);
              if (isMountedRef.current) {
                fetchUnreadCount();
              }
            }
          )
          .subscribe((status) => {
            console.log('Notification subscription status:', status);
            if (!isMountedRef.current) return;
            
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Notification subscription failed:', status);
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
        console.error('Error setting up notification realtime:', error);
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
  }, [conversationId]);

  return { unreadCount, refetchUnreadCount: fetchUnreadCount };
};
