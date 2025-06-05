
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, CheckCircle } from 'lucide-react';
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

interface TodoItemProps {
  todo: Todo;
  mentees: Mentee[];
  onTodoUpdated: (todoId: string, updates: Partial<Todo>) => void;
  onTodoDeleted: (todoId: string) => void;
}

const TodoItem = ({ todo, mentees, onTodoUpdated, onTodoDeleted }: TodoItemProps) => {
  const { toast } = useToast();

  const handleUpdateTodo = async (todoId: string, updates: Partial<Todo>) => {
    try {
      const { data, error } = await supabase
        .from('coach_todos')
        .update(updates)
        .eq('id', todoId)
        .select()
        .single();

      if (error) throw error;

      // Type cast the returned data
      const typedUpdatedTodo: Todo = {
        ...data,
        status: data.status as 'pending' | 'in_progress' | 'completed',
        priority: data.priority as 'low' | 'medium' | 'high'
      };

      onTodoUpdated(todoId, typedUpdatedTodo);

      toast({
        title: "Success",
        description: "Todo updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      const { error } = await supabase
        .from('coach_todos')
        .delete()
        .eq('id', todoId);

      if (error) throw error;

      onTodoDeleted(todoId);

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
    }
  };

  const getMenteeById = (menteeId: string) => {
    return mentees.find(m => m.id === menteeId);
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

  const mentee = getMenteeById(todo.mentee_id);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-gray-900">{todo.title}</h3>
              <Badge className={getPriorityColor(todo.priority)}>
                {todo.priority}
              </Badge>
              <Badge className={getStatusColor(todo.status)}>
                {todo.status.replace('_', ' ')}
              </Badge>
            </div>
            
            {todo.description && (
              <p className="text-gray-600 mb-2">{todo.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>
                Mentee: {mentee ? `${mentee.first_name} ${mentee.last_name}` : 'Unknown'}
              </span>
              {todo.due_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(todo.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {todo.status !== 'completed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUpdateTodo(todo.id, { status: 'completed' })}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            
            <select
              value={todo.status}
              onChange={(e) => handleUpdateTodo(todo.id, { status: e.target.value as Todo['status'] })}
              className="text-sm p-1 border border-gray-300 rounded"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
