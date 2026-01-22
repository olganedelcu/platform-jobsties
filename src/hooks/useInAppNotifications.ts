
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment' | 'session' | 'general';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export const useInAppNotifications = () => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const getActionUrl = (notificationType: string, role: string | null) => {
    switch (notificationType) {
      case 'message':
        return role === 'COACH' ? '/coach/messages' : '/messages';
      case 'todo_assignment':
        return '/todos';
      case 'session':
        return '/sessions';
      case 'job_recommendation':
        return '/dashboard';
      case 'file_upload':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setUserRole(profile?.role || 'MENTEE');

      // Use the correct table name from the migration: notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      interface RawNotification {
        id: string;
        title: string;
        content: string;
        notification_type: string;
        is_read: boolean;
        created_at: string;
      }

      const formattedNotifications: InAppNotification[] = (data || []).map((notification: RawNotification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.content || '',
        type: (notification.notification_type || 'general') as 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment' | 'session' | 'general',
        isRead: notification.is_read,
        createdAt: notification.created_at,
        actionUrl: getActionUrl(notification.notification_type || 'general', profile?.role || 'MENTEE'),
        metadata: {}
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtimeListener = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('New notification received:', payload);
            const newNotification: InAppNotification = {
              id: payload.new.id,
              title: payload.new.title,
              message: payload.new.content || '',
              type: payload.new.notification_type || 'general',
              isRead: payload.new.is_read,
              createdAt: payload.new.created_at,
              actionUrl: getActionUrl(payload.new.notification_type || 'general', userRole),
              metadata: {}
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        )
        .subscribe();
    };

    setupRealtimeListener();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [toast, userRole]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
