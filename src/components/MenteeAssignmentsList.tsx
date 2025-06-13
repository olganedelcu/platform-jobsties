import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Play, Calendar } from 'lucide-react';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';

interface MenteeAssignmentsListProps {
  userId: string;
}

const MenteeAssignmentsList = ({ userId }: MenteeAssignmentsListProps) => {
  const { assignments, loading, updateStatus } = useTodoAssignments(userId, false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async (assignmentId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    await updateStatus(assignmentId, newStatus);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading your assignments...</div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
            <p>Your coach hasn't assigned you any tasks yet. Check back later!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assignment.todo?.title || 'Untitled Task'}
                  </h3>
                  <Badge className={getPriorityColor(assignment.todo?.priority || 'medium')}>
                    {assignment.todo?.priority || 'medium'} priority
                  </Badge>
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status.replace('_', ' ')}
                  </Badge>
                </div>

                {assignment.todo?.description && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {assignment.todo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}</span>
                  </div>
                  
                  {assignment.todo?.due_date && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Due: {new Date(assignment.todo.due_date).toLocaleDateString()}</span>
                    </div>
                  )}

                  {assignment.started_at && (
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      <span>Started: {new Date(assignment.started_at).toLocaleDateString()}</span>
                    </div>
                  )}

                  {assignment.completed_at && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Completed: {new Date(assignment.completed_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                {assignment.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(assignment.id, 'in_progress')}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start Task
                  </Button>
                )}

                {assignment.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(assignment.id, 'completed')}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}

                {assignment.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(assignment.id, 'in_progress')}
                    className="flex items-center gap-2"
                  >
                    Reopen Task
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenteeAssignmentsList;
