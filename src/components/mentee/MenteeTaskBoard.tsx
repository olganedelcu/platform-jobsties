
import React, { useState } from 'react';
import TodoColumn from '@/components/todos/TodoColumn';
import AddColumnDialog from '@/components/todos/AddColumnDialog';
import AddColumnButton from '@/components/todos/AddColumnButton';
import MenteeTaskBoardHeader from './MenteeTaskBoardHeader';
import { useMenteeTaskBoard } from '@/hooks/useMenteeTaskBoard';

interface MenteeTaskBoardProps {
  userId: string;
}

const MenteeTaskBoard = ({ userId }: MenteeTaskBoardProps) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  
  const {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  } = useMenteeTaskBoard(userId);

  const handleAddColumn = (title: string) => {
    addColumn(title);
    setShowAddColumn(false);
  };

  return (
    <div className="p-6">
      <MenteeTaskBoardHeader />
      
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

export default MenteeTaskBoard;
