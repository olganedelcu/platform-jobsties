
import { getFormspreeEndpoint } from './formspreeConfig';

interface SessionRescheduleData {
  menteeEmail: string;
  menteeName: string;
  sessionType: string;
  oldSessionDate: string;
  oldSessionTime: string;
  newSessionDate: string;
  newSessionTime: string;
  duration: number;
  notes?: string;
}

interface SessionCancellationData {
  menteeEmail: string;
  menteeName: string;
  sessionType: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  notes?: string;
}

interface CourseFeedbackData {
  menteeEmail: string;
  menteeName: string;
  feedback: string;
}

// Helper function to send direct Formspree email
const sendFormspreeEmail = async (formData: FormData): Promise<void> => {
  const endpoint = getFormspreeEndpoint();
  if (!endpoint) {
    throw new Error('JobsTiesAPI notification endpoint not configured');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`JobsTiesAPI error: ${response.status}`);
  }
};

export const sendCourseFeedbackEmail = async (data: CourseFeedbackData): Promise<void> => {
  console.log("📝 JobsTiesAPI course feedback notification triggered:", {
    menteeEmail: data.menteeEmail,
    menteeName: data.menteeName,
    feedbackPreview: data.feedback.substring(0, 50) + "..."
  });

  try {
    const formData = new FormData();
    formData.append('email', data.menteeEmail);
    formData.append('name', data.menteeName);
    formData.append('subject', 'Course Feedback Received - JobsTies Platform');
    formData.append('message', `Course feedback from ${data.menteeName}:\n\n${data.feedback}\n\nBest regards,\nThe JobsTies Team`);
    formData.append('_replyto', data.menteeEmail);
    formData.append('_from', 'JobsTies Platform <feedback@jobsties.com>');

    await sendFormspreeEmail(formData);
    console.log("✅ Course feedback sent successfully via JobsTies Platform");
  } catch (error) {
    console.error('❌ JobsTies Platform course feedback notification error:', error);
    throw error;
  }
};

export const sendSessionRescheduleEmail = async (data: SessionRescheduleData): Promise<void> => {
  console.log("📅 JobsTiesAPI session reschedule notification triggered:", {
    menteeEmail: data.menteeEmail,
    menteeName: data.menteeName,
    sessionType: data.sessionType
  });

  try {
    const message = `Your ${data.sessionType} session has been rescheduled:

OLD TIME:
Date: ${data.oldSessionDate}
Time: ${data.oldSessionTime}

NEW TIME:
Date: ${data.newSessionDate}
Time: ${data.newSessionTime}

Duration: ${data.duration} minutes
${data.notes ? `Notes: ${data.notes}` : ''}

Please update your calendar accordingly.

Best regards,
The JobsTies Team`;

    const formData = new FormData();
    formData.append('email', data.menteeEmail);
    formData.append('name', data.menteeName);
    formData.append('subject', 'Session Rescheduled - JobsTies Platform');
    formData.append('message', message);
    formData.append('_replyto', data.menteeEmail);
    formData.append('_from', 'JobsTies Platform <sessions@jobsties.com>');

    await sendFormspreeEmail(formData);
    console.log("✅ Session reschedule notification sent successfully via JobsTies Platform");
  } catch (error) {
    console.error('❌ JobsTies Platform session reschedule notification error:', error);
    throw error;
  }
};

export const sendSessionCancellationEmail = async (data: SessionCancellationData): Promise<void> => {
  console.log("❌ JobsTiesAPI session cancellation notification triggered:", {
    menteeEmail: data.menteeEmail,
    menteeName: data.menteeName,
    sessionType: data.sessionType
  });

  try {
    const message = `Your ${data.sessionType} session has been cancelled:

Date: ${data.sessionDate}
Time: ${data.sessionTime}
Duration: ${data.duration} minutes
${data.notes ? `Notes: ${data.notes}` : ''}

Please contact your mentor if you need to reschedule.

Best regards,
The JobsTies Team`;

    const formData = new FormData();
    formData.append('email', data.menteeEmail);
    formData.append('name', data.menteeName);
    formData.append('subject', 'Session Cancelled - JobsTies Platform');
    formData.append('_replyto', data.menteeEmail);
    formData.append('message', message);
    formData.append('_from', 'JobsTies Platform <sessions@jobsties.com>');

    await sendFormspreeEmail(formData);
    console.log("✅ Session cancellation notification sent successfully via JobsTies Platform");
  } catch (error) {
    console.error('❌ JobsTies Platform session cancellation notification error:', error);
    throw error;
  }
};
