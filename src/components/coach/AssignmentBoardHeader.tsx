
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AssignmentBoardHeaderProps {
  title: string;
  description: string;
  onAddColumn: () => void;
}

const AssignmentBoardHeader = ({ title, description, onAddColumn }: AssignmentBoardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <Button
        variant="outline"
        onClick={onAddColumn}
        className="flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add List</span>
      </Button>
    </div>
  );
};

export default AssignmentBoardHeader;
