
import { handleJobRecommendationNotification } from './jobRecommendationNotificationHandler';
import { handleFileUploadNotification } from './fileUploadNotificationHandler';
import { handleMessageNotification } from './messageNotificationHandler';
import { handleTodoAssignmentNotification } from './todoAssignmentNotificationHandler';

// Re-export utilities for backward compatibility
export { isAnaUser } from './userValidationUtils';
export { getMenteeNotificationData } from './menteeDataUtils';

// Notification handlers for different actions
export const NotificationHandlers = {
  async jobRecommendation(
    currentUserEmail: string,
    menteeId: string, 
    jobTitle: string, 
    companyName: string
  ) {
    return handleJobRecommendationNotification(currentUserEmail, menteeId, jobTitle, companyName);
  },

  async fileUpload(
    currentUserEmail: string,
    menteeId: string, 
    fileName: string
  ) {
    return handleFileUploadNotification(currentUserEmail, menteeId, fileName);
  },

  async message(
    currentUserEmail: string,
    menteeId: string, 
    messageContent: string
  ) {
    return handleMessageNotification(currentUserEmail, menteeId, messageContent);
  },

  async todoAssignment(
    currentUserEmail: string,
    menteeIds: string[], 
    todoTitle?: string,
    count?: number
  ) {
    return handleTodoAssignmentNotification(currentUserEmail, menteeIds, todoTitle, count);
  }
};
