
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardTaskBoard } from '@/hooks/useDashboardTaskBoard';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';

interface TasksInProgressCardProps {
  userId: string;
}

const TasksInProgressCard = ({ userId }: TasksInProgressCardProps) => {
  const navigate = useNavigate();
  const { tasks: personalTasks, loading: personalLoading } = useDashboardTaskBoard(userId);
  const { assignments, loading: assignmentsLoading } = useTodoAssignments(userId, false);

  // Filter only in-progress tasks
  const inProgressPersonalTasks = personalTasks.filter(task => task.status === 'in_progress');
  const inProgressAssignments = assignments.filter(assignment => assignment.status === 'in_progress');

  // Combine and limit to 3 most recent
  const allInProgressTasks = [
    ...inProgressPersonalTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      source: 'personal' as const
    })),
    ...inProgressAssignments.map(assignment => ({
      id: assignment.id,
      title: assignment.mentee_title || assignment.todo?.title || 'Untitled Task',
      description: assignment.mentee_description || assignment.todo?.description,
      priority: assignment.mentee_priority || assignment.todo?.priority || 'medium',
      source: 'coach' as const
    }))
  ].slice(0, 3);

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (personalLoading || assignmentsLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded"></div>
            </div>
            Tasks in Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">Loading tasks...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded"></div>
            </div>
            Tasks in Progress
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/todos')}
            className="text-green-600 hover:text-green-700"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {allInProgressTasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-sm text-gray-500 mb-3">No tasks in progress</div>
            <Button
              size="sm"
              onClick={() => navigate('/todos')}
              className="flex items-center space-x-2"
            >
              <span>View All Tasks</span>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {allInProgressTasks.map(task => (
                <div key={task.id} className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      <User className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                            {task.description}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                            In Progress
                          </Badge>
                          {task.source === 'coach' && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              From Coach
                            </Badge>
                          )}
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority as 'low' | 'medium' | 'high')}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/todos')}
                className="w-full flex items-center justify-center space-x-2 text-green-600 hover:text-green-700"
              >
                <span>Task Board</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksInProgressCard;
