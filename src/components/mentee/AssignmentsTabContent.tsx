
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import MenteeAssignmentsList from '@/components/MenteeAssignmentsList';
import CoachAssignmentsBoard from '@/components/coach/CoachAssignmentsBoard';

interface AssignmentsTabContentProps {
  userId: string;
  viewMode?: 'list' | 'board';
  onViewModeChange?: (mode: 'list' | 'board') => void;
}

const AssignmentsTabContent = ({ 
  userId, 
  viewMode: externalViewMode, 
  onViewModeChange 
}: AssignmentsTabContentProps) => {
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'board'>('list');
  
  const currentViewMode = externalViewMode || internalViewMode;
  const handleViewModeChange = onViewModeChange || setInternalViewMode;

  if (currentViewMode === 'board') {
    return (
      <div className="space-y-6">
        {!onViewModeChange && (
          <div className="flex justify-end">
            <Button
              onClick={() => handleViewModeChange('list')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <List className="h-4 w-4" />
              <span>List View</span>
            </Button>
          </div>
        )}

        <CoachAssignmentsBoard coachId={userId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!onViewModeChange && (
        <div className="flex justify-end">
          <Button
            onClick={() => handleViewModeChange('board')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Board View</span>
          </Button>
        </div>
      )}
      
      <MenteeAssignmentsList userId={userId} />
    </div>
  );
};

export default AssignmentsTabContent;
