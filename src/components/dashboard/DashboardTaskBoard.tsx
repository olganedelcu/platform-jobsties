
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  // Combine and limit to first 5 tasks
  const allInProgressTasks = [...personalInProgressTasks, ...coachInProgressTasks]
    .slice(0, 5);

  const handleViewAllTasks = () => {
    navigate('/todos');
  };

  return (
    <Card className="border border-gray-200 shadow-sm h-80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <ListTodo className="h-4 w-4 mr-2 text-green-600" />
            Tasks in Progress
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewAllTasks}
            className="text-green-600 hover:text-green-700 text-xs h-6 px-2"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-0">
        {allInProgressTasks.length > 0 ? (
          <>
            <ScrollArea className="h-52">
              <div className="space-y-1.5 pr-2">
                {allInProgressTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2 p-2 bg-green-50 rounded-md border border-green-100">
                    <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                      {task.source === 'coach' ? (
                        <UserCheck className="h-3 w-3 text-green-600" />
                      ) : (
                        <ListTodo className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{task.description}</div>
                      )}
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-orange-50 text-orange-700 border-orange-200 px-1 py-0 h-4"
                        >
                          In Progress
                        </Badge>
                        {task.source === 'coach' && (
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-1 py-0 h-4"
                          >
                            From Coach
                          </Badge>
                        )}
                        {task.priority && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-1 py-0 h-4 ${
                              task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                              task.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-2 pt-1 border-t border-gray-200">
              <Button 
                onClick={handleViewAllTasks}
                variant="ghost"
                size="sm"
                className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 text-sm h-7"
              >
                Task Board
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <ListTodo className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-gray-600 mb-1 text-sm">No tasks in progress</div>
            <div className="text-xs text-gray-500 mb-2">Start working on your tasks to see them here</div>
            <Button 
              onClick={handleViewAllTasks} 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white text-sm h-7"
            >
              View All Tasks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTaskBoard;
