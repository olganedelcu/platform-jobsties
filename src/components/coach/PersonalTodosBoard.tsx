
import React, { useState } from 'react';
import { useCoachTodosBoard } from '@/hooks/useCoachTodosBoard';
import AssignmentBoardHeader from './AssignmentBoardHeader';
import AssignmentColumnGrid from './AssignmentColumnGrid';
import AddColumnDialog from '@/components/todos/AddColumnDialog';

interface PersonalTodosBoardProps {
  coachId: string;
}

const PersonalTodosBoard = ({ coachId }: PersonalTodosBoardProps) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  
  const {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  } = useCoachTodosBoard(coachId);

  const handleAddColumn = (title: string) => {
    addColumn(title);
    setShowAddColumn(false);
  };

  return (
    <div className="p-6">
      <AssignmentBoardHeader
        title="Personal Todos"
        description="Manage your personal tasks and todos"
        onAddColumn={() => setShowAddColumn(true)}
      />

      <AssignmentColumnGrid
        columns={columns}
        onAddTodo={addTodoToColumn}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        onMoveTodo={moveTodo}
        onShowAddColumn={() => setShowAddColumn(true)}
      />

      <AddColumnDialog
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={handleAddColumn}
      />
    </div>
  );
};

export default PersonalTodosBoard;
