import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '@/components/course/CourseHeader';
import CourseModule from '@/components/course/CourseModule';
import ModuleFiles from '@/components/ModuleFiles';
import MenteeCVFiles from '@/components/MenteeCVFiles';
import { courseModules } from '@/data/courseModules';
import { useCourseProgress } from '@/hooks/useCourseProgress';

interface CourseContentProps {
  userId: string;
}

const CourseContent = ({ userId }: CourseContentProps) => {
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const { progress, updateProgress } = useCourseProgress({ id: userId });

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

  // Calculate overall progress based on completed modules
  const calculateOverallProgress = () => {
    const completedModules = progress.filter(p => p.completed).length;
    return Math.min((completedModules / courseModules.length) * 100, 100);
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
          />
        ))}
      </div>

      {/* Add the Module Materials section for all shared files */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Module Materials</h2>
        <p className="text-gray-600 mb-6">
          Access all files and materials that have been shared by your coach across different modules.
        </p>
        
        <div className="space-y-6">
          <MenteeCVFiles userId={userId} />
          <ModuleFiles 
            userId={userId} 
            moduleType="linkedin" 
            title="LinkedIn & Cover Letter" 
          />
          <ModuleFiles 
            userId={userId} 
            moduleType="job_search_strategy" 
            title="Job Search Strategy" 
          />
          <ModuleFiles 
            userId={userId} 
            moduleType="interview_preparation" 
            title="Interview Preparation" 
          />
          <ModuleFiles 
            userId={userId} 
            moduleType="feedback" 
            title="Feedback & Next Steps" 
          />
        </div>
      </section>
    </main>
  );
};

export default CourseContent;
