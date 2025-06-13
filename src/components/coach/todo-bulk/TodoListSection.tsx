
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TodoItemCard from './TodoItemCard';

interface TodoItem {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

interface TodoListSectionProps {
  todos: TodoItem[];
  onAddTodo: () => void;
  onUpdateTodo: (index: number, field: keyof TodoItem, value: string) => void;
  onRemoveTodo: (index: number) => void;
}

const TodoListSection = ({ todos, onAddTodo, onUpdateTodo, onRemoveTodo }: TodoListSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Todo Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddTodo}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Todo
        </Button>
      </div>

      {todos.map((todo, index) => (
        <TodoItemCard
          key={index}
          todo={todo}
          index={index}
          canRemove={todos.length > 1}
          onUpdate={onUpdateTodo}
          onRemove={onRemoveTodo}
        />
      ))}
    </div>
  );
};

export default TodoListSection;
