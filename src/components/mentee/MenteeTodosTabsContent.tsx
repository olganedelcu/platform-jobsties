
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { useMenteeTodos } from '@/hooks/useMenteeTodos';
import MenteeTodosStats from './MenteeTodosStats';
import AssignmentsTabContent from './AssignmentsTabContent';
import PersonalTodosTabContent from './PersonalTodosTabContent';
import MenteeTodoForm from '@/components/MenteeTodoForm';
import MenteeAssignmentsList from '@/components/MenteeAssignmentsList';
import CoachAssignmentsBoard from '@/components/coach/CoachAssignmentsBoard';

interface MenteeTodosTabsContentProps {
  userId: string;
}

const MenteeTodosTabsContent = ({ userId }: MenteeTodosTabsContentProps) => {
  const [assignmentsViewMode, setAssignmentsViewMode] = useState<'list' | 'board'>('list');
  const [personalViewMode, setPersonalViewMode] = useState<'list' | 'board'>('list');
  const [showAddForm, setShowAddForm] = useState(false);

  // Get personal tasks and assignments
  const { assignments, loading: assignmentsLoading } = useTodoAssignments(userId, false);
  const { todos, loading: todosLoading, addTodo, updateStatus: updateTodoStatus, deleteTodo } = useMenteeTodos(userId);

  const handleAddTodo = async (todoData: any) => {
    await addTodo(todoData);
    setShowAddForm(false);
  };

  // Calculate task statistics
  const personalPending = todos.filter(task => task.status === 'pending').length;
  const personalInProgress = todos.filter(task => task.status === 'in_progress').length;
  const personalCompleted = todos.filter(task => task.status === 'completed').length;

  const assignmentsPending = assignments.filter(assignment => assignment.status === 'pending').length;
  const assignmentsInProgress = assignments.filter(assignment => assignment.status === 'in_progress').length;
  const assignmentsCompleted = assignments.filter(assignment => assignment.status === 'completed').length;

  const totalPending = personalPending + assignmentsPending;
  const totalInProgress = personalInProgress + assignmentsInProgress;
  const totalCompleted = personalCompleted + assignmentsCompleted;

  return (
    <>
      <MenteeTodosStats 
        totalPending={totalPending}
        totalInProgress={totalInProgress}
        totalCompleted={totalCompleted}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All Tasks
            <Badge variant="secondary" className="bg-gray-100">
              {todos.length + assignments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            Personal Tasks
            <Badge variant="secondary" className="bg-blue-100">
              {todos.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            Coach Assignments
            <Badge variant="secondary" className="bg-purple-100">
              {assignments.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-8">
            {/* Coach Assignments Section */}
            {assignments.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    Coach Assignments
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {assignments.length}
                    </Badge>
                  </h2>
                  <Button
                    onClick={() => setAssignmentsViewMode(assignmentsViewMode === 'list' ? 'board' : 'list')}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    {assignmentsViewMode === 'list' ? (
                      <>
                        <LayoutGrid className="h-4 w-4" />
                        <span>Board View</span>
                      </>
                    ) : (
                      <>
                        <List className="h-4 w-4" />
                        <span>List View</span>
                      </>
                    )}
                  </Button>
                </div>
                {assignmentsViewMode === 'list' ? (
                  <MenteeAssignmentsList userId={userId} />
                ) : (
                  <CoachAssignmentsBoard coachId={userId} />
                )}
              </div>
            )}

            {/* Personal Tasks Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  Personal Tasks
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {todos.length}
                  </Badge>
                </h2>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setPersonalViewMode(personalViewMode === 'list' ? 'board' : 'list')}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    {personalViewMode === 'list' ? (
                      <>
                        <LayoutGrid className="h-4 w-4" />
                        <span>Board View</span>
                      </>
                    ) : (
                      <>
                        <List className="h-4 w-4" />
                        <span>List View</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Task</span>
                  </Button>
                </div>
              </div>

              {showAddForm && (
                <div className="mb-6">
                  <MenteeTodoForm
                    menteeId={userId}
                    onAddTodo={handleAddTodo}
                    onCancel={() => setShowAddForm(false)}
                  />
                </div>
              )}

              <PersonalTodosTabContent
                todos={todos}
                showAddForm={false}
                todosLoading={todosLoading}
                userId={userId}
                viewMode={personalViewMode}
                onViewModeChange={setPersonalViewMode}
                onShowAddForm={() => setShowAddForm(true)}
                onAddTodo={handleAddTodo}
                onCancelAdd={() => setShowAddForm(false)}
                onUpdateStatus={updateTodoStatus}
                onDeleteTodo={deleteTodo}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">My Personal Tasks</h2>
                <p className="text-gray-600">Create and manage your personal tasks</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setPersonalViewMode(personalViewMode === 'list' ? 'board' : 'list')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {personalViewMode === 'list' ? (
                    <>
                      <LayoutGrid className="h-4 w-4" />
                      <span>Board View</span>
                    </>
                  ) : (
                    <>
                      <List className="h-4 w-4" />
                      <span>List View</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </Button>
              </div>
            </div>

            {showAddForm && (
              <MenteeTodoForm
                menteeId={userId}
                onAddTodo={handleAddTodo}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            <PersonalTodosTabContent
              todos={todos}
              showAddForm={false}
              todosLoading={todosLoading}
              userId={userId}
              viewMode={personalViewMode}
              onViewModeChange={setPersonalViewMode}
              onShowAddForm={() => setShowAddForm(true)}
              onAddTodo={handleAddTodo}
              onCancelAdd={() => setShowAddForm(false)}
              onUpdateStatus={updateTodoStatus}
              onDeleteTodo={deleteTodo}
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
