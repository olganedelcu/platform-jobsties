
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardTaskBoard } from '@/hooks/useDashboardTaskBoard';

interface DashboardTaskBoardProps {
  userId: string;
}

const DashboardTaskBoard = ({ userId }: DashboardTaskBoardProps) => {
  const navigate = useNavigate();
  const { tasks, loading, updateTaskStatus } = useDashboardTaskBoard(userId);

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">My Tasks</CardTitle>
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
          <CardTitle className="text-lg font-semibold text-gray-900">My Tasks</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/todos')}
            className="text-blue-600 hover:text-blue-700"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-sm text-gray-500 mb-3">No tasks yet</div>
            <Button
              size="sm"
              onClick={() => navigate('/todos')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{pendingTasks.length}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">{inProgressTasks.length}</div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">{completedTasks.length}</div>
                <div className="text-xs text-gray-500">Done</div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Tasks</h4>
              {tasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const nextStatus = task.status === 'pending' 
                            ? 'in_progress' 
                            : task.status === 'in_progress' 
                            ? 'completed' 
                            : 'pending';
                          updateTaskStatus(task.id, nextStatus);
                        }}
                        className="flex-shrink-0"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : task.status === 'in_progress' ? (
                          <Clock className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </div>
                        {task.due_date && (
                          <div className="text-xs text-gray-500">
                            Due: {formatDate(task.due_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>

            {tasks.length > 4 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/todos')}
                className="w-full"
              >
                View All Tasks
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTaskBoard;
