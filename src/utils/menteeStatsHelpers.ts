
import { JobApplication } from '@/types/jobApplications';
import { CVFile } from '@/hooks/useCVFiles';

export interface MenteeStats {
  totalApplications: number;
  activeApplications: number;
  interviewStage: number;
  cvCount: number;
}

export const getMenteeStats = (
  menteeId: string,
  applications: JobApplication[],
  cvFiles: CVFile[]
): MenteeStats => {
  const menteeApplications = applications.filter(app => app.mentee_id === menteeId);
  const menteeCVs = cvFiles.filter(cv => cv.mentee_id === menteeId);
  
  const totalApplications = menteeApplications.length;
  const activeApplications = menteeApplications.filter(app => 
    !['rejected', 'withdrawn'].includes(app.application_status)
  ).length;
  const interviewStage = menteeApplications.filter(app => 
    app.application_status === 'interviewing'
  ).length;
  
  return {
    totalApplications,
    activeApplications,
    interviewStage,
    cvCount: menteeCVs.length
  };
};
