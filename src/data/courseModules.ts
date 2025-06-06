
import { FileText, Linkedin, Search, Video, MessageCircle } from 'lucide-react';
import { CourseModuleData } from '@/components/course/CourseModule';

export const courseModules: CourseModuleData[] = [
  {
    title: 'CV Optimization',
    description: 'Perfect your CV to stand out to employers',
    icon: FileText,
    completed: false,
    locked: false,
    action: 'Download CV'
  },
  {
    title: 'LinkedIn & Cover Letter',
    description: 'Build your professional brand and write compelling cover letters',
    icon: Linkedin,
    completed: false,
    locked: false,
    action: null
  },
  {
    title: 'Job Search Strategy',
    description: 'Develop an effective job search approach',
    icon: Search,
    completed: false,
    locked: true,
    action: null
  },
  {
    title: 'Interview Preparation',
    description: 'Master the art of interviewing',
    icon: Video,
    completed: false,
    locked: true,
    action: null
  },
  {
    title: 'Feedback & Next Steps',
    description: 'Review progress and plan future actions',
    icon: MessageCircle,
    completed: false,
    locked: true,
    action: null
  }
];
