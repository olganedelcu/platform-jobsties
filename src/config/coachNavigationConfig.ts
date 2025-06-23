
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar,
  User,
  Settings,
  BriefcaseIcon,
  FileText,
  Upload
} from 'lucide-react';

export const navItems = [
  {
    path: '/coach/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
  },
  {
    path: '/coach/mentees',
    label: 'Mentees',
    icon: Users,
  },
  {
    path: '/coach/applications',
    label: 'Applications',
    icon: BriefcaseIcon,
  },
  {
    path: '/coach/job-recommendations',
    label: 'Job Recommendations',
    icon: FileText,
  },
  {
    path: '/coach/sessions',
    label: 'Sessions',
    icon: Calendar,
  },
  {
    path: '/coach/todos',
    label: 'Tasks',
    icon: FileText,
  },
  {
    path: '/coach/cv-upload',
    label: 'Upload File',
    icon: Upload,
  },
  {
    path: '/coach/messages',
    label: 'Messages',
    icon: MessageSquare,
  },
];

export const settingsItems = [
  {
    path: '/coach/profile',
    label: 'Profile',
    icon: User,
  },
  {
    path: '/coach/calendar',
    label: 'Calendar',
    icon: Calendar,
  },
  {
    path: '/coach/backup-management',
    label: 'Backup',
    icon: Settings,
  },
];
