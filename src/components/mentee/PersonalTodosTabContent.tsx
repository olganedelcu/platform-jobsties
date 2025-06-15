
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import MenteeTodoForm from '@/components/MenteeTodoForm';
import MenteePersonalTodosList from '@/components/MenteePersonalTodosList';
import MenteeTaskBoard from './MenteeTaskBoard';

interface PersonalTodosTabContentProps {
  todos: any[];
  showAddForm: boolean;
  todosLoading: boolean;
  userId: string;
  viewMode: 'list' | 'board';
  onViewModeChange: (mode: 'list' | 'board') => void;
  onShowAddForm: () => void;
  onAddTodo: (todoData: any) => void;
  onCancelAdd: () => void;
  onUpdateStatus: (todoId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTodo: (todoId: string) => void;
}

const PersonalTodosTabContent = ({
  todos,
  showAddForm,
  todosLoading,
  userId,
  viewMode,
  onViewModeChange,
  onShowAddForm,
  onAddTodo,
  onCancelAdd,
  onUpdateStatus,
  onDeleteTodo
}: PersonalTodosTabContentProps) => {
  if (viewMode === 'board') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">My Personal Tasks</h2>
            <p className="text-gray-600">Manage your personal tasks in board view</p>
          </div>
          <Button
            onClick={() => onViewModeChange('list')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>List View</span>
          </Button>
        </div>

        <MenteeTaskBoard userId={userId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Personal Tasks</h2>
          <p className="text-gray-600">Create and manage your personal tasks</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => onViewModeChange('board')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Board View</span>
          </Button>
          <Button
            onClick={onShowAddForm}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {showAddForm && (
        <MenteeTodoForm
          userId={userId}
          onTodoAdded={onAddTodo}
          onCancel={onCancelAdd}
        />
      )}

      <div className="space-y-4">
        {todosLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Loading your tasks...</p>
            </CardContent>
          </Card>
        ) : todos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No personal tasks yet. Add your first task to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <MenteePersonalTodosList
            todos={todos}
            onUpdateStatus={onUpdateStatus}
            onDeleteTodo={onDeleteTodo}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalTodosTabContent;
