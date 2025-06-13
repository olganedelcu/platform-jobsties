import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, CheckCircle, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  mentee_id: string;
  created_at: string;
  updated_at: string;
}

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Assignment {
  id: string;
  mentee_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface TodoItemProps {
  todo: Todo;
  mentees: Mentee[];
  onTodoUpdated: (todoId: string, updatedTodo: Partial<Todo>) => void;
  onTodoDeleted: (todoId: string) => void;
}

const TodoItem = ({ todo, mentees, onTodoUpdated, onTodoDeleted }: TodoItemProps) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
  }, [todo.id]);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('mentee_todo_assignments')
        .select('*')
        .eq('todo_id', todo.id);

      if (error) throw error;
      
      // Type cast the data to ensure proper typing
      const typedAssignments: Assignment[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'in_progress' | 'completed'
      }));
      
      setAssignments(typedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('coach_todos')
        .delete()
        .eq('id', todo.id);

      if (error) throw error;

      onTodoDeleted(todo.id);
      toast({
        title: "Success",
        description: "Todo deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'pending' | 'in_progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('coach_todos')
        .update({ status: newStatus })
        .eq('id', todo.id);

      if (error) throw error;

      onTodoUpdated(todo.id, { status: newStatus });
      toast({
        title: "Success",
        description: "Todo status updated"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update todo status",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedMentees = () => {
    return assignments.map(assignment => {
      const mentee = mentees.find(m => m.id === assignment.mentee_id);
      return mentee ? `${mentee.first_name} ${mentee.last_name}` : 'Unknown';
    }).join(', ');
  };

  const getAssignmentStatusCounts = () => {
    const counts = assignments.reduce((acc, assignment) => {
      acc[assignment.status] = (acc[assignment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const assignmentCounts = getAssignmentStatusCounts();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{todo.title}</h3>
              <Badge className={getPriorityColor(todo.priority)}>
                {todo.priority}
              </Badge>
              <Badge className={getStatusColor(todo.status)}>
                {todo.status.replace('_', ' ')}
              </Badge>
            </div>
            
            {todo.description && (
              <p className="text-gray-600 text-sm mb-2">{todo.description}</p>
            )}
            
            {todo.due_date && (
              <p className="text-sm text-gray-500 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Due: {new Date(todo.due_date).toLocaleDateString()}
              </p>
            )}

            {assignments.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Assigned to:</span>
                  <span className="text-sm text-gray-600">{getAssignedMentees()}</span>
                </div>
                
                <div className="flex gap-2 text-xs">
                  {assignmentCounts.pending && (
                    <Badge variant="outline" className="text-gray-600">
                      {assignmentCounts.pending} pending
                    </Badge>
                  )}
                  {assignmentCounts.in_progress && (
                    <Badge variant="outline" className="text-blue-600">
                      {assignmentCounts.in_progress} in progress
                    </Badge>
                  )}
                  {assignmentCounts.completed && (
                    <Badge variant="outline" className="text-green-600">
                      {assignmentCounts.completed} completed
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            {todo.status !== 'completed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('completed')}
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
