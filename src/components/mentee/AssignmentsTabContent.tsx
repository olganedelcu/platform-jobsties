
import React from 'react';
import MenteeAssignmentsList from '@/components/MenteeAssignmentsList';

interface AssignmentsTabContentProps {
  userId: string;
}

const AssignmentsTabContent = ({ userId }: AssignmentsTabContentProps) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Tasks from Your Coach</h2>
        <p className="text-gray-600">Complete tasks assigned by your coach</p>
      </div>
      <MenteeAssignmentsList userId={userId} />
    </div>
  );
};

export default AssignmentsTabContent;
