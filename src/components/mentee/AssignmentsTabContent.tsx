
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import MenteeAssignmentsList from '@/components/MenteeAssignmentsList';
import CoachAssignmentsBoard from '@/components/coach/CoachAssignmentsBoard';

interface AssignmentsTabContentProps {
  userId: string;
}

const AssignmentsTabContent = ({ userId }: AssignmentsTabContentProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  if (viewMode === 'board') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tasks from Your Coach</h2>
            <p className="text-gray-600">Complete tasks assigned by your coach in board view</p>
          </div>
          <Button
            onClick={() => setViewMode('list')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>List View</span>
          </Button>
        </div>

        <CoachAssignmentsBoard coachId={userId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tasks from Your Coach</h2>
          <p className="text-gray-600">Complete tasks assigned by your coach</p>
        </div>
        <Button
          onClick={() => setViewMode('board')}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>Board View</span>
        </Button>
      </div>
      
      <MenteeAssignmentsList userId={userId} />
    </div>
  );
};

export default AssignmentsTabContent;
