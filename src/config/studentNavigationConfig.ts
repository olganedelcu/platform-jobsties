import { 
  BarChart3, 
  FileText,
  User,
  Settings
} from 'lucide-react';

export const navItems = [
  {
    path: '/student/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
  },
  {
    path: '/student/tracker',
    label: 'Tracker',
    icon: FileText,
  },
  {
    path: '/student/todos',
    label: 'Tasks',
    icon: FileText,
  },
];

export const settingsItems = [
  {
    path: '/student/profile',
    label: 'Profile',
    icon: User,
  },
  {
    path: '/student/backup',
    label: 'Backup',
    icon: Settings,
  },
];
