
import React from 'react';
import { Briefcase, CheckSquare, Archive, Calendar } from 'lucide-react';

interface EmptyStateProps {
  type: string;
}

const EmptyState = ({ type }: EmptyStateProps) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-active-recommendations':
        return {
          icon: <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />,
          title: 'No Active Recommendations',
          description: 'All your job recommendations have been applied to or archived.'
        };
      case 'no-applied-recommendations':
        return {
          icon: <CheckSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />,
          title: 'No Applied Jobs Yet',
          description: 'Jobs you mark as applied will appear here.'
        };
      case 'no-recommendations':
        return {
          icon: <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />,
          title: 'No Recommendations Yet',
          description: 'Your coach will send you personalized job recommendations here.'
        };
      case 'current-week':
        return {
          icon: <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />,
          title: 'No new recommendations this week',
          description: 'Check back later for new job opportunities from your coach.'
        };
      default:
        return {
          icon: <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />,
          title: 'No Recommendations',
          description: 'No job recommendations found.'
        };
    }
  };

  const { icon, title, description } = getEmptyStateContent();

  return (
    <div className="text-center py-12 text-gray-500">
      {icon}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
