
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Refs to track subscription state and prevent duplicates
  const subscriptionRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback(async (userId: string) => {
    if (!userId || !mountedRef.current) return;
    
    try {
      console.log('Fetching notifications for user:', userId);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      if (mountedRef.current) {
        setNotifications(data || []);
        setLoading(false);
      }
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

      if (mountedRef.current) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true, read_at: new Date().toISOString() }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUserId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      if (mountedRef.current) {
        setNotifications(prev => 
          prev.map(notification => ({ 
            ...notification, 
            is_read: true, 
            read_at: new Date().toISOString() 
          }))
        );
      }
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  }, [currentUserId]);

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

      if (mountedRef.current) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
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

  const setupRealtimeSubscription = useCallback(async (userId: string) => {
    if (!userId || !mountedRef.current || subscriptionRef.current) {
      console.log('Skipping notification subscription setup - already exists or invalid state');
      return;
    }

    try {
      console.log('Setting up notification realtime subscription for user:', userId);
      
      const channel = supabase
        .channel(`notifications-${userId}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            if (!mountedRef.current) return;
            
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
          
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Notification subscription failed:', status);
            if (subscriptionRef.current && mountedRef.current) {
              supabase.removeChannel(subscriptionRef.current);
              subscriptionRef.current = null;
            }
          }
        });

      subscriptionRef.current = channel;
    } catch (error) {
      console.error('Error setting up notification subscription:', error);
    }
  }, []);

  const cleanupSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }
  }, []);

  // Single effect to handle auth state and subscription management
  useEffect(() => {
    let authListener: any = null;

    const initializeNotifications = async () => {
      if (isInitializedRef.current) return;
      
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mountedRef.current) {
          const userId = session.user.id;
          console.log('Initializing notifications for user:', userId);
          
          setCurrentUserId(userId);
          await fetchNotifications(userId);
          await setupRealtimeSubscription(userId);
          
          isInitializedRef.current = true;
        } else {
          setLoading(false);
        }

        // Set up auth listener for subsequent changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.id);
            
            if (event === 'SIGNED_OUT' || !session?.user) {
              cleanupSubscription();
              setCurrentUserId(null);
              setNotifications([]);
              setLoading(false);
              isInitializedRef.current = false;
            } else if (event === 'SIGNED_IN' && !isInitializedRef.current) {
              const userId = session.user.id;
              setCurrentUserId(userId);
              await fetchNotifications(userId);
              await setupRealtimeSubscription(userId);
              isInitializedRef.current = true;
            }
          }
        );

        authListener = subscription;
      } catch (error) {
        console.error('Error initializing notifications:', error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeNotifications();

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
      cleanupSubscription();
      mountedRef.current = false;
    };
  }, []); // Empty dependency array - only run once

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
