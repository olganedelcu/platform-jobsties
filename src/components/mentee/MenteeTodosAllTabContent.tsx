
import React from 'react';
import MenteeTodosSection from './MenteeTodosSection';
import { MenteeTodo } from '@/services/menteeTodosService';

interface MenteeTodosAllTabContentProps {
  userId: string;
  assignmentsViewMode: 'list' | 'board';
  personalViewMode: 'list' | 'board';
  showAddForm: boolean;
  assignmentTasks: number;
  personalTasks: number;
  todos: MenteeTodo[];
  todosLoading: boolean;
  onAssignmentsViewModeChange: (mode: 'list' | 'board') => void;
  onPersonalViewModeChange: (mode: 'list' | 'board') => void;
  onShowAddForm: () => void;
  onAddTodo: (todoData: Omit<MenteeTodo, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancelAdd: () => void;
  onUpdateStatus: (todoId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTodo: (todoId: string) => void;
  onUpdateTodo: (todoId: string, updates: Partial<MenteeTodo>) => void;
}

const MenteeTodosAllTabContent = ({
  userId,
  assignmentsViewMode,
  personalViewMode,
  showAddForm,
  assignmentTasks,
  personalTasks,
  todos,
  todosLoading,
  onAssignmentsViewModeChange,
  onPersonalViewModeChange,
  onShowAddForm,
  onAddTodo,
  onCancelAdd,
  onUpdateStatus,
  onDeleteTodo,
  onUpdateTodo
}: MenteeTodosAllTabContentProps) => {
  return (
    <div className="space-y-8">
      {/* Coach Assignments Section */}
      {assignmentTasks > 0 && (
        <MenteeTodosSection
          type="assignments"
          title="Coach Assignments"
          count={assignmentTasks}
          badgeColor="bg-purple-100 text-purple-800"
          viewMode={assignmentsViewMode}
          onViewModeChange={onAssignmentsViewModeChange}
          userId={userId}
        />
      )}

      {/* Personal Tasks Section */}
      <MenteeTodosSection
        type="personal"
        title="Personal Tasks"
        count={personalTasks}
        badgeColor="bg-blue-100 text-blue-800"
        viewMode={personalViewMode}
        onViewModeChange={onPersonalViewModeChange}
        userId={userId}
        showAddForm={showAddForm}
        onShowAddForm={onShowAddForm}
        onAddTodo={onAddTodo}
        onCancelAdd={onCancelAdd}
        todos={todos}
        todosLoading={todosLoading}
        onUpdateStatus={onUpdateStatus}
        onDeleteTodo={onDeleteTodo}
        onUpdateTodo={onUpdateTodo}
      />
    </div>
  );
};

export default MenteeTodosAllTabContent;
