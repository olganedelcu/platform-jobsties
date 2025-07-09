
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { useMenteeTodos } from '@/hooks/useMenteeTodos';
import MenteeTodosStats from './MenteeTodosStats';
import AssignmentsTabContent from './AssignmentsTabContent';
import PersonalTodosTabContent from './PersonalTodosTabContent';
import MenteeTodosAllTabContent from './MenteeTodosAllTabContent';
import MenteeTodoForm from '@/components/MenteeTodoForm';
import MenteeTodosSection from './MenteeTodosSection';

interface MenteeTodosTabsContentProps {
  userId: string;
}

const MenteeTodosTabsContent = ({ userId }: MenteeTodosTabsContentProps) => {
  const [assignmentsViewMode, setAssignmentsViewMode] = useState<'list' | 'board'>('board');
  const [personalViewMode, setPersonalViewMode] = useState<'list' | 'board'>('board');
  const [showAddForm, setShowAddForm] = useState(false);

  // Get personal tasks and assignments with error handling
  const { assignments, loading: assignmentsLoading } = useTodoAssignments(userId, false);
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

  // Memoize statistics calculations to prevent unnecessary re-renders
  const statistics = useMemo(() => {
    const personalPending = todos.filter(task => task.status === 'pending').length;
    const personalInProgress = todos.filter(task => task.status === 'in_progress').length; 
    const personalCompleted = todos.filter(task => task.status === 'completed').length;

    const assignmentsPending = assignments.filter(assignment => assignment.status === 'pending').length;
    const assignmentsInProgress = assignments.filter(assignment => assignment.status === 'in_progress').length;
    const assignmentsCompleted = assignments.filter(assignment => assignment.status === 'completed').length;

    return {
      totalPending: personalPending + assignmentsPending,
      totalInProgress: personalInProgress + assignmentsInProgress,
      totalCompleted: personalCompleted + assignmentsCompleted,
      totalTasks: todos.length + assignments.length,
      personalTasks: todos.length,
      assignmentTasks: assignments.length
    };
  }, [todos, assignments]);

  // Show loading state while data is being fetched
  if (assignmentsLoading && todosLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MenteeTodosStats 
        totalPending={statistics.totalPending}
        totalInProgress={statistics.totalInProgress}
        totalCompleted={statistics.totalCompleted}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Tasks
            <Badge variant="secondary" className="bg-gray-100">
              {statistics.totalTasks}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            Personal Tasks
            <Badge variant="secondary" className="bg-blue-100">
              {statistics.personalTasks}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            Coach Assignments
            <Badge variant="secondary" className="bg-purple-100">
              {statistics.assignmentTasks}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <MenteeTodosAllTabContent
            userId={userId}
            assignmentsViewMode={assignmentsViewMode}
            personalViewMode={personalViewMode}
            showAddForm={showAddForm}
            assignmentTasks={statistics.assignmentTasks}
            personalTasks={statistics.personalTasks}
            todos={todos}
            todosLoading={todosLoading}
            onAssignmentsViewModeChange={setAssignmentsViewMode}
            onPersonalViewModeChange={setPersonalViewMode}
            onShowAddForm={() => setShowAddForm(true)}
            onAddTodo={handleAddTodo}
            onCancelAdd={() => setShowAddForm(false)}
            onUpdateStatus={updateTodoStatus}
            onDeleteTodo={deleteTodo}
            onUpdateTodo={updateTodo}
          />
        </TabsContent>

        <TabsContent value="personal" className="mt-6">
          <div className="space-y-6">
            {showAddForm && (
              <MenteeTodoForm
                menteeId={userId}
                onAddTodo={handleAddTodo}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            <MenteeTodosSection
              type="personal"
              title="Personal Tasks"
              count={statistics.personalTasks}
              badgeColor="bg-blue-100 text-blue-800"
              viewMode={personalViewMode}
              onViewModeChange={setPersonalViewMode}
              userId={userId}
              showAddForm={showAddForm}
              onShowAddForm={() => setShowAddForm(true)}
              onAddTodo={handleAddTodo}
              onCancelAdd={() => setShowAddForm(false)}
              todos={todos}
              todosLoading={todosLoading}
              onUpdateStatus={updateTodoStatus}
              onDeleteTodo={deleteTodo}
              onUpdateTodo={updateTodo}
            />
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <AssignmentsTabContent
            userId={userId}
            viewMode={assignmentsViewMode}
            onViewModeChange={setAssignmentsViewMode}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default MenteeTodosTabsContent;
