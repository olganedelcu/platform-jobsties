
export interface JobApplication {
  id: string;
  mentee_id: string;
  date_applied: string;
  company_name: string;
  job_title: string;
  application_status: string;
  interview_stage: string | null;
  recruiter_name: string | null;
  coach_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
  } | null;
}

export interface NewJobApplicationData {
  dateApplied: string;
  companyName: string;
  jobTitle: string;
  applicationStatus: string;
  interviewStage?: string;
  recruiterName?: string;
  coachNotes?: string;
}

export interface JobApplicationsHookReturn {
  applications: JobApplication[];
  loading: boolean;
  handleAddApplication: (applicationData: NewJobApplicationData) => Promise<void>;
  handleUpdateApplication: (applicationId: string, updates: Partial<JobApplication>) => Promise<void>;
  handleDeleteApplication: (applicationId: string) => Promise<void>;
  refetchApplications: () => Promise<void>;
}
