
import React, { useState } from 'react';
import TodoColumn from './TodoColumn';
import AddColumnDialog from './AddColumnDialog';
import AddColumnButton from './AddColumnButton';
import { useTaskTodoBoard } from '@/hooks/useTaskTodoBoard';

interface TaskTodoBoardProps {
  coachId: string;
}

const TaskTodoBoard = ({ coachId }: TaskTodoBoardProps) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  
  const {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  } = useTaskTodoBoard(coachId);

  const handleAddColumn = (title: string) => {
    addColumn(title);
    setShowAddColumn(false);
  };

  return (
    <div className="p-6">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <TodoColumn
            key={column.id}
            column={column}
            onAddTodo={(todo) => addTodoToColumn(column.id, todo)}
            onUpdateTodo={(todoId, updates) => updateTodo(column.id, todoId, updates)}
            onDeleteTodo={(todoId) => deleteTodo(column.id, todoId)}
            onMoveTodo={moveTodo}
            allColumns={columns}
          />
        ))}
        
        <AddColumnButton onAddColumn={() => setShowAddColumn(true)} />
      </div>

      <AddColumnDialog
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={handleAddColumn}
      />
    </div>
  );
};

export default TaskTodoBoard;
