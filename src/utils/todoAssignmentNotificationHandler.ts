
import { isAnaUser } from './userValidationUtils';
import { FormspreeNotificationHandlers } from './formspreeNotificationUtils';

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
    console.log("📤 Sending todo assignment notifications via Formspree...");
    
    await FormspreeNotificationHandlers.todoAssignment(
      menteeIds,
      todoTitle,
      count
    );
    
    console.log("✅ Todo assignment notifications sent successfully via Formspree");
  } catch (error) {
    console.error('❌ Todo assignment notification error:', error);
  }
};
