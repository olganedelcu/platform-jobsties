
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Play, Calendar, Trash2, User, Edit } from 'lucide-react';
import { useTodoAssignments } from '@/hooks/useTodoAssignments';
import { updateAssignmentStatus, TodoAssignmentWithDetails } from '@/services/todoAssignmentService';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import EditAssignmentDialog from './mentee/EditAssignmentDialog';

interface MenteeAssignmentsListProps {
  userId: string;
}

const MenteeAssignmentsList = ({ userId }: MenteeAssignmentsListProps) => {
  const { assignments, loading, refreshAssignments } = useTodoAssignments(userId, false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingAssignment, setEditingAssignment] = useState<TodoAssignmentWithDetails | null>(null);

  const handleCardClick = (assignmentId: string) => {
    navigate(`/task/${assignmentId}`);
  };

  const handleStatusUpdate = async (assignmentId: string, status: 'pending' | 'in_progress' | 'completed') => {
    try {
      await updateAssignmentStatus(assignmentId, status);
      await refreshAssignments();
      toast({
        title: "Success",
        description: "Task status updated successfully"
      });
    } catch (error) {
      console.error('Error updating assignment status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    }
  };

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

  const getDisplayTitle = (assignment: TodoAssignmentWithDetails) => {
    return assignment.mentee_title || assignment.todo?.title || 'Untitled Task';
  };

  const getDisplayDescription = (assignment: TodoAssignmentWithDetails) => {
    return assignment.mentee_description || assignment.todo?.description || '';
  };

  const getDisplayPriority = (assignment: TodoAssignmentWithDetails) => {
    return assignment.mentee_priority || assignment.todo?.priority || 'medium';
  };

  const getDisplayDueDate = (assignment: TodoAssignmentWithDetails) => {
    return assignment.mentee_due_date || assignment.todo?.due_date;
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Loading assignments...</p>
        </CardContent>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
            <p>Your coach hasn't assigned any tasks to you yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const displayTitle = getDisplayTitle(assignment);
        const displayDescription = getDisplayDescription(assignment);
        const displayPriority = getDisplayPriority(assignment);
        const displayDueDate = getDisplayDueDate(assignment);

        return (
          <Card 
            key={assignment.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(assignment.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {displayTitle}
                    </h3>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      <User className="h-3 w-3 mr-1" />
                      Coach Assigned
                    </Badge>
                    <Badge className={getPriorityColor(displayPriority)}>
                      {displayPriority} priority
                    </Badge>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status.replace('_', ' ')}
                    </Badge>
                    {displayDueDate && isOverdue(displayDueDate) && assignment.status !== 'completed' && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Overdue
                      </Badge>
                    )}
                  </div>

                  {displayDescription && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {displayDescription}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}</span>
                    </div>
                    
                    {displayDueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className={isOverdue(displayDueDate) && assignment.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(displayDueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  {assignment.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(assignment.id, 'in_progress');
                      }}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  )}

                  {assignment.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(assignment.id, 'completed');
                      }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </Button>
                  )}

                  {assignment.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(assignment.id, 'in_progress');
                      }}
                      className="flex items-center gap-2"
                    >
                      Reopen
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAssignment(assignment);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {editingAssignment && (
        <EditAssignmentDialog
          assignment={editingAssignment}
          open={!!editingAssignment}
          onClose={() => setEditingAssignment(null)}
          onUpdate={refreshAssignments}
        />
      )}
    </div>
  );
};

export default MenteeAssignmentsList;
