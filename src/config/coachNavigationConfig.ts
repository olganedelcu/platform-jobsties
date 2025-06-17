
import { 
  Users, 
  Settings, 
  FileUp, 
  User,
  CheckSquare,
  BarChart3,
  Database,
  MessageCircle,
  Bell
} from 'lucide-react';

export const navItems = [
  { 
    path: '/coach/mentees', 
    label: 'Mentees', 
    icon: Users 
  },
  { 
    path: '/coach/applications', 
    label: 'Applications', 
    icon: BarChart3 
  },
  { 
    path: '/coach/job-recommendations', 
    label: 'Send Jobs', 
    icon: FileUp 
  },
  { 
    path: '/coach/messages', 
    label: 'Messages', 
    icon: MessageCircle 
  },
  { 
    path: '/coach/cv-upload', 
    label: 'Uploads', 
    icon: FileUp 
  },
  { 
    path: '/coach/todos', 
    label: 'Tasks', 
    icon: CheckSquare 
  }
];

export const settingsItems = [
  { 
    path: '/coach/send/notifications', 
    label: 'Notifications Settings', 
    icon: Bell 
  },
  { 
    path: '/coach/backup', 
    label: 'Backup', 
    icon: Database 
  },
  { 
    path: '/coach/profile', 
    label: 'Profile', 
    icon: User 
  },
  { 
    path: '/coach/settings', 
    label: 'Settings', 
    icon: Settings 
  }
];
