
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [assignToMentees, setAssignToMentees] = useState(false);
  const { toast } = useToast();

  const toggleMenteeSelection = (menteeId: string) => {
    setSelectedMentees(prev => 
      prev.includes(menteeId)
        ? prev.filter(id => id !== menteeId)
        : [...prev, menteeId]
    );
  };

  const handleAddTodo = async () => {
    if (!newTodo.title) {
      toast({
        title: "Error",
        description: "Please fill in the title",
        variant: "destructive"
      });
      return;
    }

    if (assignToMentees && selectedMentees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one mentee to assign the todo to",
        variant: "destructive"
      });
      return;
    }

    try {
      // First create the todo
      const { data: todoData, error: todoError } = await supabase
        .from('coach_todos')
        .insert({
          coach_id: coachId,
          title: newTodo.title,
          description: newTodo.description || null,
          mentee_id: assignToMentees ? selectedMentees[0] : mentees[0]?.id, // Required field, use first mentee
          priority: newTodo.priority,
          due_date: newTodo.due_date || null
        })
        .select()
        .single();

      if (todoError) throw todoError;

      // If assigning to mentees, create assignments
      if (assignToMentees && selectedMentees.length > 0) {
        const assignments = selectedMentees.map(menteeId => ({
          coach_id: coachId,
          mentee_id: menteeId,
          todo_id: todoData.id
        }));

        const { error: assignmentError } = await supabase
          .from('mentee_todo_assignments')
          .insert(assignments);

        if (assignmentError) throw assignmentError;
      }

      // Type cast the returned data
      const typedTodo: Todo = {
        ...todoData,
        status: todoData.status as 'pending' | 'in_progress' | 'completed',
        priority: todoData.priority as 'low' | 'medium' | 'high'
      };

      onTodoAdded(typedTodo);
      setNewTodo({
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
      });
      setSelectedMentees([]);
      setAssignToMentees(false);

      const successMessage = assignToMentees 
        ? `Todo created and assigned to ${selectedMentees.length} mentee(s)`
        : "Todo added successfully";
      
      toast({
        title: "Success",
        description: successMessage
      });
    } catch (error: any) {
      console.error('Error adding todo:', error);
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

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="assign-to-mentees"
              checked={assignToMentees}
              onCheckedChange={(checked) => setAssignToMentees(checked as boolean)}
            />
            <label htmlFor="assign-to-mentees" className="text-sm font-medium">
              Assign to mentees
            </label>
          </div>

          {assignToMentees && (
            <div className="space-y-2 p-4 border rounded-md bg-gray-50">
              <p className="text-sm font-medium">Select mentees to assign this todo:</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {mentees.map((mentee) => (
                  <div key={mentee.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mentee-${mentee.id}`}
                      checked={selectedMentees.includes(mentee.id)}
                      onCheckedChange={() => toggleMenteeSelection(mentee.id)}
                    />
                    <label htmlFor={`mentee-${mentee.id}`} className="text-sm">
                      {mentee.first_name} {mentee.last_name}
                    </label>
                  </div>
                ))}
              </div>
              {selectedMentees.length > 0 && (
                <p className="text-xs text-gray-600">
                  {selectedMentees.length} mentee(s) selected
                </p>
              )}
            </div>
          )}
        </div>

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
