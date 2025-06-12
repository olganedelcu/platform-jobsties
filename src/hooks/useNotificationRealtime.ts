
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/notifications';

interface UseNotificationRealtimeProps {
  onNotificationAdded: (notification: Notification) => void;
  onNotificationUpdated: (notification: Notification) => void;
  onNotificationDeleted: (notification: Notification) => void;
  mountedRef: React.MutableRefObject<boolean>;
}

export const useNotificationRealtime = ({
  onNotificationAdded,
  onNotificationUpdated,
  onNotificationDeleted,
  mountedRef
}: UseNotificationRealtimeProps) => {
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && mountedRef.current) {
          // Clean up any existing channel
          if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
          }

          const channel = supabase
            .channel(`notifications-${user.id}-${Date.now()}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
              },
              (payload) => {
                if (mountedRef.current) {
                  console.log('New notification received:', payload);
                  const newNotification = payload.new as Notification;
                  onNotificationAdded(newNotification);
                  
                  // Show toast for new notifications
                  toast({
                    title: newNotification.title,
                    description: newNotification.content || 'You have a new message.',
                  });
                }
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
              },
              (payload) => {
                if (mountedRef.current) {
                  console.log('Notification updated:', payload);
                  const updatedNotification = payload.new as Notification;
                  onNotificationUpdated(updatedNotification);
                }
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'DELETE',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
              },
              (payload) => {
                if (mountedRef.current) {
                  console.log('Notification deleted:', payload);
                  const deletedNotification = payload.old as Notification;
                  onNotificationDeleted(deletedNotification);
                }
              }
            );

          channel.subscribe((status) => {
            console.log('Notification subscription status:', status);
          });

          channelRef.current = channel;
        }
      } catch (error) {
        console.error('Error setting up notification subscription:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.error('Error cleaning up notification channel:', error);
        }
        channelRef.current = null;
      }
    };
  }, [onNotificationAdded, onNotificationUpdated, onNotificationDeleted, mountedRef, toast]);

  return { channelRef };
};
