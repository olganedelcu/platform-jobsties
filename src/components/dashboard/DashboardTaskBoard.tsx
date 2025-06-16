
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListTodo, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMenteeTaskBoard } from '@/hooks/useMenteeTaskBoard';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';

interface DashboardTaskBoardProps {
  userId: string;
}

const DashboardTaskBoard = ({ userId }: DashboardTaskBoardProps) => {
  const navigate = useNavigate();
  const { columns: personalColumns } = useMenteeTaskBoard(userId);
  const { assignments } = useTodoAssignments(userId, false);

  // Get in-progress personal tasks
  const personalInProgressTasks = personalColumns
    .flatMap(column => column.todos)
    .filter(todo => todo.status === 'in_progress')
    .map(task => ({ ...task, source: 'personal' as const }));

  // Get in-progress coach-assigned tasks
  const coachInProgressTasks = assignments
    .filter(assignment => assignment.status === 'in_progress')
    .map(assignment => ({
      id: assignment.id,
      title: assignment.todo?.title || 'Untitled Task',
      description: assignment.todo?.description,
      status: assignment.status as 'in_progress',
      priority: assignment.todo?.priority || 'medium' as const,
      due_date: assignment.todo?.due_date,
      assigned_date: assignment.assigned_at,
      source: 'coach' as const
    }));

  // Combine and limit to first 3 tasks
  const allInProgressTasks = [...personalInProgressTasks, ...coachInProgressTasks]
    .slice(0, 3);

  const handleViewAllTasks = () => {
    navigate('/todos');
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
            <ListTodo className="h-5 w-5 mr-2 text-green-600" />
            Tasks in Progress
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewAllTasks}
            className="text-green-600 hover:text-green-700"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {allInProgressTasks.length > 0 ? (
          <div className="space-y-3">
            {allInProgressTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {task.source === 'coach' ? (
                    <UserCheck className="h-5 w-5 text-green-600" />
                  ) : (
                    <ListTodo className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                    >
                      In Progress
                    </Badge>
                    {task.source === 'coach' && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        From Coach
                      </Badge>
                    )}
                    {task.priority && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                          task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {task.priority} priority
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <ListTodo className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-600 mb-2">No tasks in progress</div>
            <div className="text-sm text-gray-500 mb-4">Start working on your tasks to see them here</div>
            <Button 
              onClick={handleViewAllTasks} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              View All Tasks
            </Button>
          </div>
        )}
        
        {allInProgressTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button 
              onClick={handleViewAllTasks}
              variant="ghost"
              className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              View Task Board
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTaskBoard;
