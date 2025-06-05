
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

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

interface TodoFormProps {
  mentees: Mentee[];
  coachId: string;
  onTodoAdded: (todo: Todo) => void;
  onCancel: () => void;
}

const TodoForm = ({ mentees, coachId, onTodoAdded, onCancel }: TodoFormProps) => {
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    mentee_id: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });
  const { toast } = useToast();

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

      onTodoAdded(typedTodo);
      setNewTodo({
        title: '',
        description: '',
        mentee_id: '',
        priority: 'medium',
        due_date: ''
      });

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

  return (
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoForm;
