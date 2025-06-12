
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  user_id: string;
  message_id?: string;
  conversation_id?: string;
  notification_type: string;
  title: string;
  content?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  getConversationUnreadCount: (conversationId: string) => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<any>(null);
  const currentUserIdRef = useRef<string | null>(null);

  // Stable callback functions using useCallback
  const fetchNotifications = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const userId = currentUserIdRef.current;
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          is_read: true, 
          read_at: new Date().toISOString() 
        }))
      );
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error in deleteNotification:', error);
    }
  }, []);

  const getConversationUnreadCount = useCallback((conversationId: string) => {
    return notifications.filter(n => 
      n.conversation_id === conversationId && 
      !n.is_read
    ).length;
  }, [notifications]);

  // Initialize and manage subscriptions
  useEffect(() => {
    let mounted = true;

    const initializeNotifications = async () => {
      try {
        console.log('Initializing notification context...');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || !mounted) {
          setLoading(false);
          return;
        }

        currentUserIdRef.current = user.id;
        console.log('Fetching initial notifications for user:', user.id);
        
        await fetchNotifications(user.id);

        // Clean up any existing subscription
        if (subscriptionRef.current) {
          console.log('Cleaning up existing notification subscription');
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }

        // Set up new subscription
        console.log('Setting up notification realtime subscription');
        const channel = supabase
          .channel(`notifications-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              if (!mounted) return;
              
              console.log('Notification change received:', payload);
              
              if (payload.eventType === 'INSERT') {
                setNotifications(prev => [payload.new as Notification, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                setNotifications(prev => 
                  prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
                );
              } else if (payload.eventType === 'DELETE') {
                setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
              }
            }
          )
          .subscribe((status) => {
            console.log('Notification subscription status:', status);
          });

        subscriptionRef.current = channel;
        setLoading(false);
      } catch (error) {
        console.error('Error initializing notifications:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeNotifications();

    return () => {
      console.log('Notification context cleanup');
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getConversationUnreadCount
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
