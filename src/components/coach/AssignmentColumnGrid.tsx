
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TodoColumn from '@/components/todos/TodoColumn';
import { TodoColumnType, TodoItem } from '@/types/assignmentBoard';

interface AssignmentColumnGridProps {
  columns: TodoColumnType[];
  onAddTodo: (columnId: string, todo: Omit<TodoItem, 'id'>) => void;
  onUpdateTodo: (columnId: string, todoId: string, updates: Partial<TodoItem>) => void;
  onDeleteTodo: (columnId: string, todoId: string) => void;
  onMoveTodo: (fromColumnId: string, toColumnId: string, todoId: string) => void;
  onShowAddColumn: () => void;
}

const AssignmentColumnGrid = ({
  columns,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onMoveTodo,
  onShowAddColumn
}: AssignmentColumnGridProps) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <TodoColumn
          key={column.id}
          column={column}
          onAddTodo={(todo) => onAddTodo(column.id, todo)}
          onUpdateTodo={(todoId, updates) => onUpdateTodo(column.id, todoId, updates)}
          onDeleteTodo={(todoId) => onDeleteTodo(column.id, todoId)}
          onMoveTodo={onMoveTodo}
          allColumns={columns}
        />
      ))}
      
      <Card className="min-w-80 bg-gray-50">
        <CardContent className="p-4">
          <Button
            variant="ghost"
            onClick={onShowAddColumn}
            className="w-full justify-start text-gray-600 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another list
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentColumnGrid;
