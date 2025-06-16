
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TodoCard from './TodoCard';
import AddTodoDialog from './AddTodoDialog';
import { TodoColumnType } from '@/types/assignmentBoard';

interface TodoColumnProps {
  column: TodoColumnType;
  onAddTodo: (todo: any) => void;
  onUpdateTodo: (todoId: string, updates: any) => void;
  onDeleteTodo: (todoId: string) => void;
  onMoveTodo: (todoId: string, fromColumnId: string, toColumnId: string) => void;
  allColumns: TodoColumnType[];
  showCoachAssignedLabel?: boolean;
}

const TodoColumn = ({
  column,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onMoveTodo,
  allColumns,
  showCoachAssignedLabel = false
}: TodoColumnProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddTodo = (todoData: any) => {
    onAddTodo(todoData);
    setShowAddDialog(false);
  };

  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {column.title}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({column.todos.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {column.todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onUpdate={(updates) => onUpdateTodo(todo.id, updates)}
            onDelete={() => onDeleteTodo(todo.id)}
            onMove={onMoveTodo}
            allColumns={allColumns}
            currentColumnId={column.id}
            showCoachAssignedLabel={showCoachAssignedLabel}
          />
        ))}
        
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>

        <AddTodoDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAdd={handleAddTodo}
        />
      </CardContent>
    </Card>
  );
};

export default TodoColumn;
