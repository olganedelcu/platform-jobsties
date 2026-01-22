
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MenteeTodosViewToggle from './MenteeTodosViewToggle';
import MenteeAssignmentsList from '@/components/MenteeAssignmentsList';
import CoachAssignmentsBoard from '@/components/coach/CoachAssignmentsBoard';
import PersonalTodosTabContent from './PersonalTodosTabContent';
import MenteeTodoForm from '@/components/MenteeTodoForm';
import { MenteeTodo } from '@/services/menteeTodosService';

interface MenteeTodosSectionProps {
  type: 'assignments' | 'personal';
  title: string;
  count: number;
  badgeColor: string;
  viewMode: 'list' | 'board';
  onViewModeChange: (mode: 'list' | 'board') => void;
  userId: string;
  showAddForm?: boolean;
  onShowAddForm?: () => void;
  onAddTodo?: (todoData: Omit<MenteeTodo, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancelAdd?: () => void;
  todos?: MenteeTodo[];
  todosLoading?: boolean;
  onUpdateStatus?: (todoId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTodo?: (todoId: string) => void;
  onUpdateTodo?: (todoId: string, updates: Partial<MenteeTodo>) => void;
}

const MenteeTodosSection = ({
  type,
  title,
  count,
  badgeColor,
  viewMode,
  onViewModeChange,
  userId,
  showAddForm = false,
  onShowAddForm,
  onAddTodo,
  onCancelAdd,
  todos,
  todosLoading,
  onUpdateStatus,
  onDeleteTodo,
  onUpdateTodo
}: MenteeTodosSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
            {title}
            <Badge variant="secondary" className={badgeColor}>
              {count}
            </Badge>
          </h2>
        </div>
        <div className="flex gap-3">
          <MenteeTodosViewToggle
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
          {type === 'personal' && onShowAddForm && (
            <Button
              onClick={onShowAddForm}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          )}
        </div>
      </div>

      {showAddForm && onAddTodo && onCancelAdd && (
        <div className="mb-6">
          <MenteeTodoForm
            menteeId={userId}
            onAddTodo={onAddTodo}
            onCancel={onCancelAdd}
          />
        </div>
      )}

      {type === 'assignments' ? (
        viewMode === 'list' ? (
          <MenteeAssignmentsList userId={userId} />
        ) : (
          <CoachAssignmentsBoard coachId={userId} />
        )
      ) : (
        <PersonalTodosTabContent
          todos={todos || []}
          showAddForm={false}
          todosLoading={todosLoading || false}
          userId={userId}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onShowAddForm={() => {}}
          onAddTodo={onAddTodo || (() => {})}
          onCancelAdd={onCancelAdd || (() => {})}
          onUpdateStatus={onUpdateStatus || (() => {})}
          onDeleteTodo={onDeleteTodo || (() => {})}
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </div>
  );
};

export default MenteeTodosSection;
