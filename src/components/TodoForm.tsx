
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTodoFormState } from '@/hooks/useTodoFormState';
import TodoFormFields from './forms/TodoFormFields';
import TodoMenteeAssignment from './forms/TodoMenteeAssignment';
import TodoFormActions from './forms/TodoFormActions';

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
  const {
    formData,
    setFormData,
    selectedMentees,
    assignToMentees,
    setAssignToMentees,
    toggleMenteeSelection,
    resetForm
  } = useTodoFormState();

  const { toast } = useToast();

  const handleAddTodo = async () => {
    if (!formData.title) {
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
          title: formData.title,
          description: formData.description || null,
          mentee_id: assignToMentees ? selectedMentees[0] : mentees[0]?.id, // Required field, use first mentee
          priority: formData.priority,
          due_date: formData.due_date || null
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
      resetForm();

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

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Todo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TodoFormFields
          formData={formData}
          onFormDataChange={setFormData}
        />

        <TodoMenteeAssignment
          mentees={mentees}
          assignToMentees={assignToMentees}
          selectedMentees={selectedMentees}
          onAssignToMenteesChange={setAssignToMentees}
          onMenteeSelectionToggle={toggleMenteeSelection}
        />

        <TodoFormActions
          onAddTodo={handleAddTodo}
          onCancel={handleCancel}
        />
      </CardContent>
    </Card>
  );
};

export default TodoForm;
