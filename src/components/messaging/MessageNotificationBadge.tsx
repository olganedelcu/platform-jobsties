
import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const MessageNotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const fetchUnreadCount = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || !mountedRef.current) {
        console.error('Error getting user or component unmounted:', userError);
        return;
      }

      // Get user's conversations
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id')
        .or(`mentee_id.eq.${user.id},coach_email.eq.ana@jobsties.com`);

      if (conversationsError || !mountedRef.current) {
        console.error('Error fetching conversations:', conversationsError);
        setUnreadCount(0);
        return;
      }

      if (!conversations || conversations.length === 0) {
        setUnreadCount(0);
        return;
      }

      const conversationIds = conversations.map(c => c.id);

      // Count unread messages in user's conversations
      const { count, error: countError } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .in('conversation_id', conversationIds)
        .eq('read_status', false)
        .neq('sender_id', user.id);

      if (countError) {
        console.error('Error counting unread messages:', countError);
        return;
      }

      if (mountedRef.current) {
        setUnreadCount(count || 0);
      }
    } catch (error) {
      console.error('Error in fetchUnreadCount:', error);
      if (mountedRef.current) {
        setUnreadCount(0);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial fetch
    fetchUnreadCount();

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Set up real-time subscription for new messages
    try {
      const channel = supabase
        .channel(`unread-messages-${Date.now()}`) // Use unique channel name
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            if (mountedRef.current) {
              fetchUnreadCount();
            }
          }
        );

      channel.subscribe((status) => {
        console.log('Subscription status:', status);
      });

      channelRef.current = channel;
    } catch (subscriptionError) {
      console.error('Error setting up subscription:', subscriptionError);
    }

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (cleanupError) {
          console.error('Error cleaning up channel:', cleanupError);
        }
        channelRef.current = null;
      }
    };
  }, []);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default MessageNotificationBadge;
