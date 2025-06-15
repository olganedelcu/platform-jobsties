
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import TodoCard from './TodoCard';
import AddTodoDialog from './AddTodoDialog';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_date?: string;
}

interface TodoColumn {
  id: string;
  title: string;
  todos: TodoItem[];
}

interface TodoColumnProps {
  column: TodoColumn;
  onAddTodo: (todo: Omit<TodoItem, 'id'>) => void;
  onUpdateTodo: (todoId: string, updates: Partial<TodoItem>) => void;
  onDeleteTodo: (todoId: string) => void;
  onMoveTodo: (fromColumnId: string, toColumnId: string, todoId: string) => void;
  allColumns: TodoColumn[];
}

const TodoColumn = ({
  column,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onMoveTodo,
  allColumns
}: TodoColumnProps) => {
  const [showAddTodo, setShowAddTodo] = useState(false);

  const handleAddTodo = (todo: Omit<TodoItem, 'id'>) => {
    onAddTodo(todo);
    setShowAddTodo(false);
  };

  return (
    <Card className="min-w-80 bg-gray-50 max-h-[calc(100vh-200px)] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">
            {column.title}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-3 px-3 pb-3">
        {column.todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onUpdate={(updates) => onUpdateTodo(todo.id, updates)}
            onDelete={() => onDeleteTodo(todo.id)}
            onMove={(toColumnId) => onMoveTodo(column.id, toColumnId, todo.id)}
            allColumns={allColumns}
          />
        ))}
        
        <Button
          variant="ghost"
          onClick={() => setShowAddTodo(true)}
          className="w-full justify-start text-gray-600 hover:bg-gray-100 h-8"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </CardContent>

      <AddTodoDialog
        open={showAddTodo}
        onClose={() => setShowAddTodo(false)}
        onAdd={handleAddTodo}
      />
    </Card>
  );
};

export default TodoColumn;
