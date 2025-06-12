
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const MessageNotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's conversations
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`mentee_id.eq.${user.id},coach_email.eq.ana@jobsties.com`);

      if (!conversations || conversations.length === 0) {
        setUnreadCount(0);
        return;
      }

      const conversationIds = conversations.map(c => c.id);

      // Count unread messages in user's conversations
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .in('conversation_id', conversationIds)
        .eq('read_status', false)
        .neq('sender_id', user.id);

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Set up real-time subscription for new messages
    const messagesChannel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
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
