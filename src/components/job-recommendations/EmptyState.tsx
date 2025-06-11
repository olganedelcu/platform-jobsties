
import React from 'react';
import { Briefcase } from 'lucide-react';

interface EmptyStateProps {
  type: 'current-week' | 'no-recommendations';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === 'current-week') {
    return (
      <div className="text-center py-8 text-gray-500">
        <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No job recommendations added this week yet.</p>
        <p className="text-sm">Check back soon for new opportunities!</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 text-gray-500">
      <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium mb-2">No Job Recommendations Yet</h3>
      <p>Your coach will share personalized job recommendations here.</p>
      <p className="text-sm">These will be tailored to your skills and career goals.</p>
    </div>
  );
};

export default EmptyState;
