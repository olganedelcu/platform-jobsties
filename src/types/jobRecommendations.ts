
export interface JobRecommendation {
  id: string;
  coach_id: string;
  mentee_id: string;
  job_title: string;
  job_link: string;
  company_name: string;
  week_start_date: string;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'applied' | 'archived';
  applied_date?: string;
  archived?: boolean;
  application_stage?: string;
}

export interface NewJobRecommendationData {
  menteeId: string;
  jobTitle: string;
  jobLink: string;
  companyName: string;
  weekStartDate: string;
}
