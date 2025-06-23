import { EnhancedNotificationHandlers } from './enhancedNotificationHandler';

// Updated main notification utilities with enhanced system
export const NotificationHandlers = {
  async jobRecommendation(
    currentUserEmail: string,
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    return EnhancedNotificationHandlers.jobRecommendation(menteeId, jobTitle, companyName);
  },

  async fileUpload(
    currentUserEmail: string,
    menteeId: string, 
    fileName: string
  ) {
    return EnhancedNotificationHandlers.fileUpload(menteeId, fileName);
  },

  async message(
    currentUserEmail: string,
    menteeId: string, 
    messageContent: string
  ) {
    return EnhancedNotificationHandlers.message(menteeId, messageContent);
  },

  async todoAssignment(
    currentUserEmail: string,
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    return EnhancedNotificationHandlers.todoAssignment(menteeIds, todoTitle, count);
  }
};

// Keep backward compatibility exports
export { getMenteeNotificationData } from './menteeDataUtils';
export const isAnaUser = () => true; // Now all users can send notifications
