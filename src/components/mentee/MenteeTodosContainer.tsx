
import React, { useState } from 'react';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { useMenteeTodos } from '@/hooks/useMenteeTodos';
import MenteeTodosHeader from './MenteeTodosHeader';
import MenteeTodosTabNavigation from './MenteeTodosTabNavigation';
import AssignmentsTabContent from './AssignmentsTabContent';
import PersonalTodosTabContent from './PersonalTodosTabContent';

interface MenteeTodosContainerProps {
  userId: string;
}

const MenteeTodosContainer = ({ userId }: MenteeTodosContainerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'assignments' | 'personal'>('assignments');

  // Hooks for todo management
  const { assignments } = useTodoAssignments(userId, false);
  const { todos, loading: todosLoading, addTodo, updateStatus: updateTodoStatus, deleteTodo } = useMenteeTodos(userId);

  const handleAddTodo = async (todoData: any) => {
    await addTodo(todoData);
    setShowAddForm(false);
  };

  console.log('Rendering MenteeTodosContainer with user:', userId);

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <MenteeTodosHeader />

      <MenteeTodosTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        assignmentsCount={assignments.length}
        todosCount={todos.length}
      />

      {/* Content based on active tab */}
      {activeTab === 'assignments' && (
        <AssignmentsTabContent userId={userId} />
      )}

      {activeTab === 'personal' && (
        <PersonalTodosTabContent
          todos={todos}
          showAddForm={showAddForm}
          todosLoading={todosLoading}
          userId={userId}
          onShowAddForm={() => setShowAddForm(true)}
          onAddTodo={handleAddTodo}
          onCancelAdd={() => setShowAddForm(false)}
          onUpdateStatus={updateTodoStatus}
          onDeleteTodo={deleteTodo}
        />
      )}
    </main>
  );
};

export default MenteeTodosContainer;
