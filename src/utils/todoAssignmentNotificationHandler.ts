
import { isAnaUser } from './userValidationUtils';
import { FormspreeNotificationHandlers } from './formspree/formspreeHandlers';
import { InAppNotificationService } from '@/services/inAppNotificationService';

export const handleTodoAssignmentNotification = async (
  currentUserEmail: string,
  menteeIds: string[], 
  todoTitle?: string,
  count?: number
) => {
  console.log("✅ Todo assignment notification triggered:", {
    currentUserEmail,
    menteeIds,
    todoTitle,
    count
  });

  if (!isAnaUser(currentUserEmail)) {
    console.log("⏭️ Skipping notification - not Ana user");
    return;
  }

  try {
    console.log("📤 Sending todo assignment notifications...");
    
    // Send notifications to all mentees
    const notificationPromises = menteeIds.map(async (menteeId) => {
      // Send in-app notification
      await InAppNotificationService.sendTodoAssignmentNotification(
        menteeId,
        todoTitle,
        count
      );
    });

    await Promise.all(notificationPromises);
    
    // Send email notifications via Formspree bundling
    await FormspreeNotificationHandlers.todoAssignment(
      menteeIds,
      todoTitle,
      count
    );
    
    console.log("✅ Todo assignment notifications sent successfully");
  } catch (error) {
    console.error('❌ Todo assignment notification error:', error);
  }
};
