
import React, { useState } from 'react';
import { useCoachAssignmentsBoard } from '@/hooks/useCoachAssignmentsBoard';
import AssignmentBoardHeader from './AssignmentBoardHeader';
import AssignmentColumnGrid from './AssignmentColumnGrid';
import AddColumnDialog from '@/components/todos/AddColumnDialog';
import { CoachAssignmentsBoardProps } from '@/types/assignmentBoard';

const CoachAssignmentsBoard = ({ coachId }: CoachAssignmentsBoardProps) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  
  const {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  } = useCoachAssignmentsBoard(coachId);

  const handleAddColumn = (title: string) => {
    addColumn(title);
    setShowAddColumn(false);
  };

  return (
    <div className="p-6">
      <AssignmentBoardHeader
        title="Coach Assigned Tasks"
        description="Track and manage tasks assigned by your coach"
        onAddColumn={() => setShowAddColumn(true)}
      />

      <AssignmentColumnGrid
        columns={columns}
        onAddTodo={addTodoToColumn}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        onMoveTodo={moveTodo}
        onShowAddColumn={() => setShowAddColumn(true)}
        showCoachAssignedLabel={true}
      />

      <AddColumnDialog
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={handleAddColumn}
      />
    </div>
  );
};

export default CoachAssignmentsBoard;
