
// Re-export all functionality for backward compatibility
export { isFormspreeEnabled, getFormspreeEndpoint } from './formspree/formspreeConfig';
export { getMenteeFormspreeData } from './formspree/formspreMenteeData';
export { FormspreeNotificationHandlers } from './formspree/formspreeHandlers';
export { 
  sendCourseFeedbackEmail, 
  sendSessionRescheduleEmail, 
  sendSessionCancellationEmail 
} from './formspree/formspreeEmailTemplates';
