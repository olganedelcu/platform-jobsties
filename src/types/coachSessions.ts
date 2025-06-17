
export interface CoachSession {
  id: string;
  session_type: string;
  session_date: string;
  duration: number;
  notes: string;
  preferred_coach: string;
  status: string;
  meeting_link: string;
  coach_id: string;
  mentee_id: string;
  created_at: string;
  updated_at: string;
  mentee_name?: string;
  mentee_email?: string;
  cal_com_booking_id?: string;
}

export interface CoachSessionsHookReturn {
  sessions: CoachSession[];
  loading: boolean;
  handleConfirmSession: (sessionId: string) => Promise<boolean>;
  handleCancelSession: (sessionId: string) => Promise<boolean>;
  refetchSessions: () => Promise<void>;
}
