
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '@/components/course/CourseHeader';
import CourseModule from '@/components/course/CourseModule';
import { courseModules } from '@/data/courseModules';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useConversations } from '@/hooks/useConversations';
import { useToast } from '@/hooks/use-toast';

interface CourseContentProps {
  userId: string;
}

const CourseContent = ({ userId }: CourseContentProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const { progress, updateProgress } = useCourseProgress({ id: userId });
  const { createConversation } = useConversations();

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const handleCompleteModule = async (moduleIndex: number, moduleTitle: string) => {
    await updateProgress(moduleTitle, 100, true);
  };

  const handleUncompleteModule = async (moduleIndex: number, moduleTitle: string) => {
    await updateProgress(moduleTitle, 0, false);
  };

  const handleBookCall = () => {
    navigate('/sessions');
  };

  const handleMessageCoach = async (moduleIndex: number, moduleTitle: string, moduleDescription: string) => {
    try {
      const subject = `Question about ${moduleTitle}`;
      const initialMessage = `Hi! I have a question about the "${moduleTitle}" module. ${moduleDescription}`;

      const conversation = await createConversation(subject, initialMessage);
      
      if (conversation) {
        toast({
          title: "Success",
          description: "Conversation created! Redirecting to messages...",
        });
        navigate('/messages');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate overall progress based on completed modules using the exact same logic as dashboard
  const calculateOverallProgress = () => {
    const completedModules = progress.filter(p => p.completed).length;
    const totalModules = progress.length;
    const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    console.log('Course page progress calculation:', {
      completedModules,
      totalModules,
      overallProgress,
      progress
    });
    
    return overallProgress;
  };

  // Check if a module is completed
  const isModuleCompleted = (moduleTitle: string) => {
    return progress.some(p => p.moduleTitle === moduleTitle && p.completed);
  };

  // Determine if a module should be locked based on dependencies
  const isModuleLocked = (moduleIndex: number) => {
    // First two modules (CV Optimization and LinkedIn & Cover Letter) are always unlocked
    if (moduleIndex <= 1) return false;
    
    // Job Search Strategy unlocks when first 2 modules are completed
    if (moduleIndex === 2) {
      const firstTwoCompleted = courseModules.slice(0, 2).every(module => 
        isModuleCompleted(module.title)
      );
      return !firstTwoCompleted;
    }
    
    // Interview Preparation unlocks when Job Search Strategy is completed
    if (moduleIndex === 3) {
      return !isModuleCompleted('Job Search Strategy');
    }
    
    // Feedback & Next Steps unlocks when Interview Preparation is completed
    if (moduleIndex === 4) {
      return !isModuleCompleted('Interview Preparation');
    }
    
    return false;
  };

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <CourseHeader progress={calculateOverallProgress()} />

      <div className="space-y-6">
        {courseModules.map((module, index) => (
          <CourseModule
            key={index}
            module={{
              ...module,
              completed: isModuleCompleted(module.title),
              locked: isModuleLocked(index)
            }}
            index={index}
            expanded={expandedModule === index}
            userId={userId}
            onToggle={() => toggleModule(index)}
            onComplete={() => handleCompleteModule(index, module.title)}
            onUncomplete={() => handleUncompleteModule(index, module.title)}
            onBookCall={handleBookCall}
            onMessageCoach={() => handleMessageCoach(index, module.title, module.description)}
          />
        ))}
      </div>
    </main>
  );
};

export default CourseContent;
