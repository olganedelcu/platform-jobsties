
import { NotificationRequest } from './types.ts';

export const generateEmailContent = (
  actionType: string,
  menteeName: string,
  actionDetails: NotificationRequest['actionDetails']
): { subject: string; htmlContent: string } => {
  let subject = "";
  let htmlContent = "";

  switch (actionType) {
    case 'job_recommendation':
      subject = `New Job Recommendation from Ana`;
      htmlContent = `
        <h1>New Job Recommendation!</h1>
        <p>Hi ${menteeName},</p>
        <p>Ana has sent you a new job recommendation:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4f46e5; margin: 15px 0;">
          <strong>${actionDetails.jobTitle}</strong> at <strong>${actionDetails.companyName}</strong>
        </div>
        <p>Log in to your JobsTies dashboard to view the full details and apply!</p>
        <p>Best of luck with your job search!</p>
        <hr>
        <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
      `;
      break;

    case 'file_upload':
      subject = `New File from Ana`;
      htmlContent = `
        <h1>New File Available!</h1>
        <p>Hi ${menteeName},</p>
        <p>Ana has uploaded a new file for you:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
          📄 <strong>${actionDetails.fileName}</strong>
        </div>
        <p>Log in to your JobsTies dashboard to download and review the file.</p>
        <p>Keep up the great work!</p>
        <hr>
        <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
      `;
      break;

    case 'message':
      subject = `New Message from Ana`;
      htmlContent = `
        <h1>New Message!</h1>
        <p>Hi ${menteeName},</p>
        <p>Ana has sent you a new message:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0;">
          ${actionDetails.messagePreview}
        </div>
        <p>Log in to your JobsTies dashboard to read the full message and reply.</p>
        <p>Stay connected!</p>
        <hr>
        <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
      `;
      break;

    case 'todo_assignment':
      const todoCount = actionDetails.count || 1;
      subject = `New Task${todoCount > 1 ? 's' : ''} from Ana`;
      htmlContent = `
        <h1>New Task${todoCount > 1 ? 's' : ''} Assigned!</h1>
        <p>Hi ${menteeName},</p>
        <p>Ana has assigned ${todoCount > 1 ? `${todoCount} new tasks` : 'a new task'} to help with your career journey:</p>
        ${actionDetails.todoTitle ? `
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #8b5cf6; margin: 15px 0;">
          ✓ <strong>${actionDetails.todoTitle}</strong>
        </div>
        ` : ''}
        <p>Log in to your JobsTies dashboard to view ${todoCount > 1 ? 'all tasks' : 'the task'} and mark ${todoCount > 1 ? 'them' : 'it'} as complete when done.</p>
        <p>You've got this!</p>
        <hr>
        <p style="color: #777; font-size: 12px;">JobsTies Platform</p>
      `;
      break;

    default:
      console.error("Unknown action type:", actionType);
      throw new Error("Unknown action type");
  }

  return { subject, htmlContent };
};
