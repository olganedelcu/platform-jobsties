
export interface JobApplication {
  id: string;
  mentee_id: string;
  company_name: string;
  job_title: string;
  job_link?: string;
  date_applied: string;
  application_status: 'applied' | 'interviewed' | 'offered' | 'rejected' | 'withdrawn';
  interview_stage?: string;
  recruiter_name?: string;
  coach_notes?: string;
  mentee_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NewJobApplicationData {
  company_name: string;
  job_title: string;
  job_link?: string;
  date_applied: string;
  application_status: 'applied' | 'interviewed' | 'offered' | 'rejected' | 'withdrawn';
  interview_stage?: string;
  recruiter_name?: string;
  mentee_notes?: string;
}

export interface JobApplicationsDataHookReturn {
  applications: JobApplication[];
  loading: boolean;
  handleAddApplication: (applicationData: NewJobApplicationData) => Promise<void>;
  handleUpdateApplication: (id: string, updates: Partial<JobApplication>) => Promise<void>;
  handleDeleteApplication: (id: string) => Promise<void>;
  refetchApplications: () => Promise<void>;
}
