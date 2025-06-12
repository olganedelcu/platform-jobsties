
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NotificationService } from '@/services/notificationService';
import { useNotificationRealtime } from '@/hooks/useNotificationRealtime';
import { Notification } from '@/types/notifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  getConversationUnreadCount: (conversationId: string) => number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const updateUnreadCount = useCallback((notificationList: Notification[]) => {
    const count = notificationList.filter(n => !n.is_read).length;
    setUnreadCount(count);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await NotificationService.fetchNotifications();
      
      if (mountedRef.current) {
        setNotifications(data);
        updateUnreadCount(data);
      }
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: "Failed to load notifications.",
          variant: "destructive"
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [updateUnreadCount, toast]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);

      if (mountedRef.current) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();

      if (mountedRef.current) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);

      if (mountedRef.current) {
        const notificationToDelete = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        if (notificationToDelete && !notificationToDelete.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error in deleteNotification:', error);
    }
  }, [notifications]);

  const getConversationUnreadCount = useCallback((conversationId: string) => {
    return notifications.filter(n => 
      n.conversation_id === conversationId && !n.is_read
    ).length;
  }, [notifications]);

  // Realtime event handlers
  const handleNotificationAdded = useCallback((notification: Notification) => {
    if (mountedRef.current) {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const handleNotificationUpdated = useCallback((updatedNotification: Notification) => {
    if (mountedRef.current) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === updatedNotification.id ? updatedNotification : n
        )
      );
      
      // Recalculate unread count
      setNotifications(current => {
        const updated = current.map(n => 
          n.id === updatedNotification.id ? updatedNotification : n
        );
        updateUnreadCount(updated);
        return updated;
      });
    }
  }, [updateUnreadCount]);

  const handleNotificationDeleted = useCallback((deletedNotification: Notification) => {
    if (mountedRef.current) {
      setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
      
      if (!deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  }, []);

  // Set up realtime subscription
  useNotificationRealtime({
    onNotificationAdded: handleNotificationAdded,
    onNotificationUpdated: handleNotificationUpdated,
    onNotificationDeleted: handleNotificationDeleted,
    mountedRef
  });

  useEffect(() => {
    mountedRef.current = true;
    
    // Only fetch once on mount
    fetchNotifications();

    return () => {
      mountedRef.current = false;
    };
  }, []); // Empty dependency array - only run once

  const contextValue = {
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
