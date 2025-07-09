
import React, { useState } from 'react';
import { useMenteeTodos } from '@/hooks/useMenteeTodos';
import PersonalTodosTabContent from './PersonalTodosTabContent';

interface MenteeTodosContainerProps {
  userId: string;
}

const MenteeTodosContainer = ({ userId }: MenteeTodosContainerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

  // Hooks for todo management
  const { 
    todos, 
    loading: todosLoading, 
    addTodo, 
    updateStatus: updateTodoStatus, 
    deleteTodo,
    updateTodo
  } = useMenteeTodos(userId);

  const handleAddTodo = async (todoData: any) => {
    await addTodo(todoData);
    setShowAddForm(false);
  };

  return (
    <PersonalTodosTabContent
      todos={todos}
      showAddForm={showAddForm}
      todosLoading={todosLoading}
      userId={userId}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onShowAddForm={() => setShowAddForm(true)}
      onAddTodo={handleAddTodo}
      onCancelAdd={() => setShowAddForm(false)}
      onUpdateStatus={updateTodoStatus}
      onDeleteTodo={deleteTodo}
      onUpdateTodo={updateTodo}
    />
  );
};

export default MenteeTodosContainer;
