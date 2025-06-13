
import { useState } from 'react';

export const useNotifications = () => {
  // Return zero unread count since notifications are disabled
  const unreadCount = 0;

  return {
    unreadCount
  };
};
