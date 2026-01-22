
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MenteePersonalTodosList from '@/components/MenteePersonalTodosList';
import MenteeTaskBoard from './MenteeTaskBoard';
import { MenteeTodo } from '@/services/menteeTodosService';

interface PersonalTodosTabContentProps {
  todos: MenteeTodo[];
  showAddForm: boolean;
  todosLoading: boolean;
  userId: string;
  viewMode: 'list' | 'board';
  onViewModeChange: (mode: 'list' | 'board') => void;
  onShowAddForm: () => void;
  onAddTodo: (todoData: Omit<MenteeTodo, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancelAdd: () => void;
  onUpdateStatus: (todoId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTodo: (todoId: string) => void;
  onUpdateTodo?: (todoId: string, updates: Partial<MenteeTodo>) => void;
}

const PersonalTodosTabContent = ({
  todos,
  todosLoading,
  userId,
  viewMode,
  onUpdateStatus,
  onDeleteTodo,
  onUpdateTodo
}: PersonalTodosTabContentProps) => {
  if (viewMode === 'board') {
    return <MenteeTaskBoard userId={userId} />;
  }

  return (
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
          onUpdateTodo={onUpdateTodo}
        />
      )}
    </div>
  );
};

export default PersonalTodosTabContent;
