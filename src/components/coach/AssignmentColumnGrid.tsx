
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import TodoColumn from '@/components/todos/TodoColumn';
import AddColumnButton from '@/components/todos/AddColumnButton';
import { TodoColumnType, TodoItem } from '@/types/assignmentBoard';

interface AssignmentColumnGridProps {
  columns: TodoColumnType[];
  onAddTodo: (columnId: string, todo: Partial<TodoItem>) => void;
  onUpdateTodo: (columnId: string, todoId: string, updates: Partial<TodoItem>) => void;
  onDeleteTodo: (columnId: string, todoId: string) => void;
  onMoveTodo: (todoId: string, fromColumnId: string, toColumnId: string) => void;
  onShowAddColumn: () => void;
  showCoachAssignedLabel?: boolean;
}

const AssignmentColumnGrid = ({
  columns,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onMoveTodo,
  onShowAddColumn,
  showCoachAssignedLabel = false
}: AssignmentColumnGridProps) => {
  const enhanceColumns = (columns: TodoColumnType[]) => {
    if (!showCoachAssignedLabel) return columns;
    
    return columns.map(column => ({
      ...column,
      todos: column.todos.map(todo => ({
        ...todo,
        isCoachAssigned: true
      }))
    }));
  };

  const enhancedColumns = enhanceColumns(columns);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {enhancedColumns.map((column) => (
        <TodoColumn
          key={column.id}
          column={column}
          onAddTodo={(todo) => onAddTodo(column.id, todo)}
          onUpdateTodo={(todoId, updates) => onUpdateTodo(column.id, todoId, updates)}
          onDeleteTodo={(todoId) => onDeleteTodo(column.id, todoId)}
          onMoveTodo={onMoveTodo}
          allColumns={enhancedColumns}
          showCoachAssignedLabel={showCoachAssignedLabel}
        />
      ))}
      
      <AddColumnButton onAddColumn={onShowAddColumn} />
    </div>
  );
};

export default AssignmentColumnGrid;
