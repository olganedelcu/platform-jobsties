
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar,
  CheckSquare,
  Upload,
  Briefcase
} from 'lucide-react';

export const navItems = [
  { path: '/coach/mentees', label: 'Mentees', icon: Users },
  { path: '/coach/applications', label: 'Applications', icon: FileText },
  { path: '/coach/job-recommendations', label: 'Send Jobs', icon: Briefcase },
  { path: '/coach/sessions', label: 'Sessions', icon: Calendar },
  { path: '/coach/todos', label: 'Tasks', icon: CheckSquare },
  { path: '/coach/messages', label: 'Messages', icon: MessageSquare },
];

export const settingsItems = [
  { path: '/coach/calendar', label: 'Calendar', icon: Calendar },
  { path: '/coach/cv-upload', label: 'CV Upload', icon: Upload },
  { path: '/coach/backup', label: 'Backup', icon: FileText },
];
