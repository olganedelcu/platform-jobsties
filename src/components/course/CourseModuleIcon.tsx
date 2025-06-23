
import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';

interface CourseModuleIconProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  locked: boolean;
  completed: boolean;
}

const CourseModuleIcon = ({ icon: Icon, locked, completed }: CourseModuleIconProps) => {
  return (
    <div className={`p-2 rounded-lg ${
      locked 
        ? 'bg-gray-100' 
        : completed 
        ? 'bg-green-100' 
        : 'bg-gradient-to-r from-blue-100 to-blue-200'
    }`}>
      {locked ? (
        <Lock className="h-6 w-6 text-gray-400" />
      ) : completed ? (
        <CheckCircle className="h-6 w-6 text-green-600" />
      ) : (
        <Icon className="h-6 w-6 text-blue-600" />
      )}
    </div>
  );
};

export default CourseModuleIcon;
