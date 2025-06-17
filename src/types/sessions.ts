
export interface Session {
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
  google_event_id?: string;
  google_calendar_id?: string;
  cal_com_booking_id?: string;
}

export interface NewSessionData {
  sessionType: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  preferredCoach: string;
}

export interface SessionsDataHookReturn {
  sessions: Session[];
  loading: boolean;
  handleAddSession: (sessionData: NewSessionData) => Promise<void>;
  handleUpdateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
  handleDeleteSession: (sessionId: string) => Promise<void>;
  refetchSessions: () => Promise<void>;
}
