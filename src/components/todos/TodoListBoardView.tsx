
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import TaskTodoBoard from './TaskTodoBoard';
import SendTodosToMentees from '@/components/coach/SendTodosToMentees';
import TodoListHeader from './TodoListHeader';

interface TodoListBoardViewProps {
  coachId: string;
  showSendToMentees: boolean;
  onViewModeChange: (mode: 'list' | 'board') => void;
  onToggleSendToMentees: () => void;
}

const TodoListBoardView = ({
  coachId,
  showSendToMentees,
  onViewModeChange,
  onToggleSendToMentees
}: TodoListBoardViewProps) => {
  return (
    <div className="space-y-6">
      <TodoListHeader
        viewMode="board"
        showSendToMentees={showSendToMentees}
        onViewModeChange={onViewModeChange}
        onToggleSendToMentees={onToggleSendToMentees}
        onShowAddForm={() => {}} // Not used in board view
      />

      {/* Send to Mentees Section */}
      {showSendToMentees && (
        <SendTodosToMentees coachId={coachId} />
      )}

      <TaskTodoBoard coachId={coachId} />
    </div>
  );
};

export default TodoListBoardView;
