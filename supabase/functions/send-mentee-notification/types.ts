
export interface NotificationRequest {
  menteeEmail: string;
  menteeName: string;
  actionType: 'job_recommendation' | 'file_upload' | 'message' | 'todo_assignment';
  actionDetails: {
    jobTitle?: string;
    companyName?: string;
    fileName?: string;
    messagePreview?: string;
    todoTitle?: string;
    count?: number;
  };
}

export interface EmailData {
  from: string;
  to: string[];
  subject: string;
  html: string;
}
