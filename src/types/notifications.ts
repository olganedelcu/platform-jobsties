
export interface Notification {
  id: string;
  user_id: string;
  message_id: string | null;
  conversation_id: string | null;
  notification_type: string;
  title: string;
  content: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
