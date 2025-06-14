
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import TodoItemCard from './TodoItemCard';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
}

interface TodoListSectionProps {
  todos: TodoItem[];
  onAddTodo: () => void;
  onUpdateTodo: (id: string, field: keyof TodoItem, value: string) => void;
  onRemoveTodo: (id: string) => void;
}

const TodoListSection = ({ todos, onAddTodo, onUpdateTodo, onRemoveTodo }: TodoListSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-medium">Todo Items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddTodo}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Todo
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {todos.map((todo, index) => (
          <TodoItemCard
            key={todo.id}
            todo={todo}
            index={index}
            canRemove={todos.length > 1}
            onUpdate={onUpdateTodo}
            onRemove={onRemoveTodo}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoListSection;
