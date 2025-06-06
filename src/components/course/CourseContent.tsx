
import React, { useState } from 'react';
import CourseHeader from '@/components/course/CourseHeader';
import CourseModule from '@/components/course/CourseModule';
import { courseModules } from '@/data/courseModules';

interface CourseContentProps {
  userId: string;
}

const CourseContent = ({ userId }: CourseContentProps) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(0); // Default to first module expanded

  const toggleModule = (index: number) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <CourseHeader progress={0} />

      <div className="space-y-6">
        {courseModules.map((module, index) => (
          <CourseModule
            key={index}
            module={module}
            index={index}
            expanded={expandedModule === index}
            userId={userId}
            onToggle={() => toggleModule(index)}
          />
        ))}
      </div>
    </main>
  );
};

export default CourseContent;
