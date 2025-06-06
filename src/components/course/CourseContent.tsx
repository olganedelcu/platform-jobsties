
import React, { useState } from 'react';
import CourseHeader from '@/components/course/CourseHeader';
import CourseModule from '@/components/course/CourseModule';
import MenteeCVFiles from '@/components/MenteeCVFiles';
import { courseModules } from '@/data/courseModules';
import { useCourseProgress } from '@/hooks/useCourseProgress';

interface CourseContentProps {
  userId: string;
}

const CourseContent = ({ userId }: CourseContentProps) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const { progress, updateProgress } = useCourseProgress({ id: userId });

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const handleCompleteModule = async (moduleIndex: number, moduleTitle: string) => {
    await updateProgress(moduleTitle, 100, true);
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

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <CourseHeader progress={calculateOverallProgress()} />

      <div className="space-y-6">
        {courseModules.map((module, index) => (
          <CourseModule
            key={index}
            module={{
              ...module,
              completed: isModuleCompleted(module.title)
            }}
            index={index}
            expanded={expandedModule === index}
            userId={userId}
            onToggle={() => toggleModule(index)}
            onComplete={() => handleCompleteModule(index, module.title)}
          />
        ))}
      </div>

      {/* Add the CV Files section for mentees */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">CV Optimization</h2>
        <p className="text-gray-600 mb-6">
          Access your CV files that have been reviewed by your coach. Download and update them based on the feedback.
        </p>
        <MenteeCVFiles userId={userId} />
      </section>
    </main>
  );
};

export default CourseContent;
