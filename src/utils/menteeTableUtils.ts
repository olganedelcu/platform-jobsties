
import { Mentee } from '@/hooks/useMentees';
import { JobApplication } from '@/types/jobApplications';

interface CVFile {
  id: string;
  file_name: string;
  mentee_id: string;
}

export const getMenteeApplications = (menteeId: string, applications: JobApplication[]) => {
  return applications.filter(app => app.mentee_id === menteeId);
};

export const getMenteeCVFiles = (menteeId: string, cvFiles: CVFile[]) => {
  return cvFiles.filter(cv => cv.mentee_id === menteeId);
};

export const getStatusCounts = (menteeApplications: JobApplication[]) => {
  const counts = {
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0
  };

  menteeApplications.forEach(app => {
    if (app.application_status === 'applied') counts.applied++;
    else if (app.application_status === 'interview') counts.interview++;
    else if (app.application_status === 'offer') counts.offer++;
    else if (app.application_status === 'rejected') counts.rejected++;
  });

  return counts;
};
