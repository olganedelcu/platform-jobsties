import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, CheckCircle, Clock, Users, ExternalLink } from 'lucide-react';
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
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/task/${todo.id}`);
  };

  // Function to detect and convert URLs to clickable links
  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <div key={index} className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3 text-blue-600 flex-shrink-0" />
                <a
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {part}
                </a>
              </div>
            );
          }
          return part ? (
            <span key={index} className="block text-sm text-gray-600 leading-relaxed">
              {part}
            </span>
          ) : null;
        })}
      </div>
    );
  };

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
    <Card className="mb-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-semibold text-lg">{todo.title}</h3>
              <Badge className={`${getPriorityColor(todo.priority)} px-3 py-1`}>
                {todo.priority} priority
              </Badge>
              <Badge className={`${getStatusColor(todo.status)} px-3 py-1`}>
                {todo.status.replace('_', ' ')}
              </Badge>
            </div>
            
            {todo.description && (
              <div className="mb-6 p-5 bg-gray-50 rounded-xl min-h-[120px] border-l-4 border-blue-200">
                <div className="space-y-3">
                  {renderTextWithLinks(todo.description)}
                </div>
              </div>
            )}
            
            {todo.due_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Due:</span>
                <span>{new Date(todo.due_date).toLocaleDateString()}</span>
              </div>
            )}

            {assignments.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Assigned to:</span>
                  <span className="text-sm text-blue-700">{getAssignedMentees()}</span>
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
          
          <div className="flex gap-2 ml-6 flex-shrink-0">
            {todo.status !== 'completed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate('completed');
                }}
                className="px-3 py-2"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={loading}
              className="px-3 py-2"
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
