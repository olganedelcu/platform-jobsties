
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NotificationService } from '@/services/notificationService';
import { useNotificationRealtime } from '@/hooks/useNotificationRealtime';
import { Notification } from '@/types/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const updateUnreadCount = useCallback((notificationList: Notification[]) => {
    const count = notificationList.filter(n => !n.is_read).length;
    setUnreadCount(count);
  }, []);

  const fetchNotifications = async () => {
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
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);

      // Update local state
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
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();

      // Update local state
      if (mountedRef.current) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);

      // Update local state
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
  };

  // Realtime event handlers
  const handleNotificationAdded = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const handleNotificationUpdated = useCallback((updatedNotification: Notification) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === updatedNotification.id ? updatedNotification : n
      )
    );
    
    // Update unread count based on the change
    setNotifications(current => {
      updateUnreadCount(current.map(n => 
        n.id === updatedNotification.id ? updatedNotification : n
      ));
      return current;
    });
  }, [updateUnreadCount]);

  const handleNotificationDeleted = useCallback((deletedNotification: Notification) => {
    setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
    
    if (!deletedNotification.is_read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
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
    fetchNotifications();

    return () => {
      mountedRef.current = false;
    };
  }, []);

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
