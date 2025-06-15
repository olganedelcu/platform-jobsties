
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, LayoutGrid, List } from 'lucide-react';

interface TodoListHeaderProps {
  viewMode: 'list' | 'board';
  showSendToMentees: boolean;
  onViewModeChange: (mode: 'list' | 'board') => void;
  onToggleSendToMentees: () => void;
  onShowAddForm: () => void;
}

const TodoListHeader = ({
  viewMode,
  showSendToMentees,
  onViewModeChange,
  onToggleSendToMentees,
  onShowAddForm
}: TodoListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
      <div className="flex gap-3">
        {viewMode === 'list' ? (
          <Button
            onClick={() => onViewModeChange('board')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Board View</span>
          </Button>
        ) : (
          <Button
            onClick={() => onViewModeChange('list')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>List View</span>
          </Button>
        )}
        <Button
          onClick={onToggleSendToMentees}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Users className="h-4 w-4" />
          <span>Send to Mentees</span>
        </Button>
        {viewMode === 'list' && (
          <Button
            onClick={onShowAddForm}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Personal Todo</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TodoListHeader;
