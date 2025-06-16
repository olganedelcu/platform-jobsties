
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Coach Assignments</h2>
        </div>
        {!onViewModeChange && (
          <Button
            onClick={() => handleViewModeChange(currentViewMode === 'list' ? 'board' : 'list')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {currentViewMode === 'list' ? (
              <>
                <LayoutGrid className="h-4 w-4" />
                <span>Board View</span>
              </>
            ) : (
              <>
                <List className="h-4 w-4" />
                <span>List View</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      {currentViewMode === 'list' ? (
        <MenteeAssignmentsList userId={userId} />
      ) : (
        <CoachAssignmentsBoard coachId={userId} />
      )}
    </div>
  );
};

export default AssignmentsTabContent;
