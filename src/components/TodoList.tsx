
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
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

interface TodoListProps {
  mentees: Mentee[];
  coachId: string;
}

const TodoList = ({ mentees, coachId }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    mentee_id: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchTodos();
  }, [coachId]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coach_todos')
        .select('*')
        .eq('coach_id', coachId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure it matches our Todo interface
      const typedTodos: Todo[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'in_progress' | 'completed',
        priority: item.priority as 'low' | 'medium' | 'high'
      }));
      
      setTodos(typedTodos);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.title || !newTodo.mentee_id) {
      toast({
        title: "Error",
        description: "Please fill in title and select a mentee",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coach_todos')
        .insert({
          coach_id: coachId,
          title: newTodo.title,
          description: newTodo.description || null,
          mentee_id: newTodo.mentee_id,
          priority: newTodo.priority,
          due_date: newTodo.due_date || null
        })
        .select()
        .single();

      if (error) throw error;

      // Type cast the returned data
      const typedTodo: Todo = {
        ...data,
        status: data.status as 'pending' | 'in_progress' | 'completed',
        priority: data.priority as 'low' | 'medium' | 'high'
      };

      setTodos([typedTodo, ...todos]);
      setNewTodo({
        title: '',
        description: '',
        mentee_id: '',
        priority: 'medium',
        due_date: ''
      });
      setShowAddForm(false);

      toast({
        title: "Success",
        description: "Todo added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive"
      });
    }
  };

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

      setTodos(todos.map(todo => 
        todo.id === todoId ? { ...todo, ...typedUpdatedTodo } : todo
      ));

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

      setTodos(todos.filter(todo => todo.id !== todoId));

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

  if (loading) {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Todo List</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Todo</span>
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Todo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Todo title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            />
            
            <Textarea
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            />

            <select
              value={newTodo.mentee_id}
              onChange={(e) => setNewTodo({ ...newTodo, mentee_id: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select mentee</option>
              {mentees.map((mentee) => (
                <option key={mentee.id} value={mentee.id}>
                  {mentee.first_name} {mentee.last_name}
                </option>
              ))}
            </select>

            <select
              value={newTodo.priority}
              onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <Input
              type="date"
              placeholder="Due date (optional)"
              value={newTodo.due_date}
              onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
            />

            <div className="flex space-x-2">
              <Button onClick={handleAddTodo}>Add Todo</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {todos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No todos yet. Add your first todo to get started!</p>
            </CardContent>
          </Card>
        ) : (
          todos.map((todo) => {
            const mentee = getMenteeById(todo.mentee_id);
            return (
              <Card key={todo.id}>
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
          })
        )}
      </div>
    </div>
  );
};

export default TodoList;
