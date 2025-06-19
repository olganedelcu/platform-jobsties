
import { FileText, Linkedin, Search, Video, MessageCircle } from 'lucide-react';
import { CourseModuleData } from '@/components/course/CourseModule';

export const courseModules: CourseModuleData[] = [
  {
    title: 'CV Optimization',
    description: '',
    icon: FileText,
    completed: false,
    locked: false,
    action: 'Download CV'
  },
  {
    title: 'LinkedIn & Cover Letter',
    description: '',
    icon: Linkedin,
    completed: false,
    locked: false,
    action: null
  },
  {
    title: 'Job Search Strategy',
    description: '',
    icon: Search,
    completed: false,
    locked: false,
    action: null
  },
  {
    title: 'Interview Preparation',
    description: '',
    icon: Video,
    completed: false,
    locked: true,
    action: 'Book Call'
  },
  {
    title: 'Feedback & Next Steps',
    description: '',
    icon: MessageCircle,
    completed: false,
    locked: true,
    action: null
  }
];
