
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConversationNotifications = (conversationId: string | null) => {
  const [unreadCount, setUnreadCount] = useState(0);

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
    fetchUnreadCount();

    // Set up real-time subscription for notifications
    const notificationsChannel = supabase
      .channel(`conversation-notifications-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [conversationId]);

  return { unreadCount, refetchUnreadCount: fetchUnreadCount };
};
