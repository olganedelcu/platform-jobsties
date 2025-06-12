
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationNotifications = (conversationId: string | null) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  const fetchUnreadCount = async () => {
    if (!conversationId) {
      setUnreadCount(0);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Error in fetchUnreadCount:', error);
    }
  };

  useEffect(() => {
    if (!conversationId) {
      setUnreadCount(0);
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
          console.log('No session available for notifications realtime subscription');
          return;
        }

        const channel = supabase
          .channel(`conversation-notifications-${conversationId}`, {
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
              fetchUnreadCount();
            }
          )
          .subscribe((status) => {
            console.log('Notification subscription status:', status);
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('Notification subscription failed:', status);
              isSubscribedRef.current = false;
              // Retry after a delay
              setTimeout(setupChannel, 3000);
            }
          });

        channelRef.current = channel;
      } catch (error) {
        console.error('Error setting up notification realtime:', error);
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
  }, [conversationId]);

  return { unreadCount, refetchUnreadCount: fetchUnreadCount };
};
