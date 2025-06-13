
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MenteePersonalTodosList from '@/components/MenteePersonalTodosList';
import MenteeTodoForm from '@/components/MenteeTodoForm';
import { MenteeTodo } from '@/services/menteeTodosService';

interface PersonalTodosTabContentProps {
  todos: MenteeTodo[];
  showAddForm: boolean;
  todosLoading: boolean;
  userId: string;
  onShowAddForm: () => void;
  onAddTodo: (todoData: any) => Promise<void>;
  onCancelAdd: () => void;
  onUpdateStatus: (todoId: string, status: 'pending' | 'in_progress' | 'completed') => Promise<void>;
  onDeleteTodo: (todoId: string) => Promise<void>;
}

const PersonalTodosTabContent = ({
  todos,
  showAddForm,
  todosLoading,
  userId,
  onShowAddForm,
  onAddTodo,
  onCancelAdd,
  onUpdateStatus,
  onDeleteTodo
}: PersonalTodosTabContentProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Personal Todos</h2>
          <p className="text-gray-600">Create and manage your own weekly todo list</p>
        </div>
        <Button
          onClick={onShowAddForm}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Todo</span>
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <MenteeTodoForm
            onAddTodo={onAddTodo}
            onCancel={onCancelAdd}
            menteeId={userId}
          />
        </div>
      )}

      {todosLoading ? (
        <div className="text-center py-8">
          <div className="text-lg">Loading your todos...</div>
        </div>
      ) : (
        <MenteePersonalTodosList
          todos={todos}
          onUpdateStatus={onUpdateStatus}
          onDeleteTodo={onDeleteTodo}
        />
      )}
    </div>
  );
};

export default PersonalTodosTabContent;
