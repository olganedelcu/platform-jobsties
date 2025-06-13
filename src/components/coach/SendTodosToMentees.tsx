
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createTodoAssignments } from '@/services/todoAssignmentService';
import MenteeMultiSelector from './MenteeMultiSelector';
import TodoListSection from './todo-bulk/TodoListSection';
import SendTodosActions from './todo-bulk/SendTodosActions';

interface TodoItem {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

interface SendTodosToMenteesProps {
  coachId: string;
}

const SendTodosToMentees = ({ coachId }: SendTodosToMenteesProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { title: '', description: '', priority: 'medium', due_date: '' }
  ]);
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addTodo = () => {
    setTodos([...todos, { title: '', description: '', priority: 'medium', due_date: '' }]);
  };

  const removeTodo = (index: number) => {
    if (todos.length > 1) {
      setTodos(todos.filter((_, i) => i !== index));
    }
  };

  const updateTodo = (index: number, field: keyof TodoItem, value: string) => {
    const updatedTodos = todos.map((todo, i) => 
      i === index ? { ...todo, [field]: value } : todo
    );
    setTodos(updatedTodos);
  };

  const toggleMenteeSelection = (menteeId: string) => {
    setSelectedMentees(prev => 
      prev.includes(menteeId)
        ? prev.filter(id => id !== menteeId)
        : [...prev, menteeId]
    );
  };

  const validateTodos = () => {
    return todos.every(todo => todo.title.trim() !== '');
  };

  const handleSendTodos = async () => {
    if (!validateTodos()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all todo titles",
        variant: "destructive"
      });
      return;
    }

    if (selectedMentees.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one mentee",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('=== SENDING TODOS TO MENTEES ===');
      console.log('Coach ID:', coachId);
      console.log('Selected mentees:', selectedMentees);
      console.log('Todos to send:', todos);

      // Create todos in coach_todos table and assignments for each mentee
      for (const todo of todos) {
        console.log('Creating todo:', todo.title);
        
        // Create the todo first
        const { data: todoData, error: todoError } = await supabase
          .from('coach_todos')
          .insert({
            coach_id: coachId,
            title: todo.title.trim(),
            description: todo.description.trim() || null,
            priority: todo.priority,
            due_date: todo.due_date || null,
            mentee_id: selectedMentees[0], // Required field, use first mentee
            status: 'pending'
          })
          .select()
          .single();

        console.log('Todo created:', todoData);
        if (todoError) throw todoError;

        // Create assignments for all selected mentees
        console.log('Creating assignments for todo:', todoData.id);
        await createTodoAssignments(coachId, todoData.id, selectedMentees);
        console.log('Assignments created for todo:', todoData.id);
      }

      toast({
        title: "Success",
        description: `${todos.length} todo(s) sent to ${selectedMentees.length} mentee(s)`,
      });

      // Reset form
      setTodos([{ title: '', description: '', priority: 'medium', due_date: '' }]);
      setSelectedMentees([]);
      
      console.log('=== TODOS SENT SUCCESSFULLY ===');
    } catch (error: any) {
      console.error('Error sending todos:', error);
      toast({
        title: "Error",
        description: "Failed to send todos to mentees",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Todos to Mentees
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mentee Selection */}
        <div>
          <MenteeMultiSelector
            selectedMentees={selectedMentees}
            onToggleMentee={toggleMenteeSelection}
          />
        </div>

        {/* Todo Items */}
        <TodoListSection
          todos={todos}
          onAddTodo={addTodo}
          onUpdateTodo={updateTodo}
          onRemoveTodo={removeTodo}
        />

        {/* Send Button */}
        <SendTodosActions
          isSubmitting={isSubmitting}
          todoCount={todos.length}
          selectedMenteeCount={selectedMentees.length}
          onSend={handleSendTodos}
        />
      </CardContent>
    </Card>
  );
};

export default SendTodosToMentees;
