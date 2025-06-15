
import { useInAppNotifications } from './useInAppNotifications';

export const useNotifications = () => {
  const { unreadCount } = useInAppNotifications();

  return {
    unreadCount
  };
};
