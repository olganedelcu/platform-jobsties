
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTodoForm } from '@/hooks/useTodoForm';
import TodoFormFields from './forms/TodoFormFields';
import TodoMenteeAssignment from './forms/TodoMenteeAssignment';

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
    handleAddTodo,
    onCancel: handleCancel
  } = useTodoForm(mentees, coachId, onTodoAdded, onCancel);

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

        <div className="flex space-x-2">
          <Button onClick={handleAddTodo}>Add Todo</Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoForm;
