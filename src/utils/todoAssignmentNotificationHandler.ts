
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

  // Send Formspree bundled notifications only
  try {
    await FormspreeNotificationHandlers.todoAssignment(
      menteeIds,
      todoTitle,
      count
    );
    console.log("✅ Todo assignment notifications sent successfully");
  } catch (error) {
    console.error('❌ Formspree todo assignment notification error:', error);
  }
};
