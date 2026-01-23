
import { useState } from 'react';
import { useMentees } from '@/hooks/useMentees';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string; // Changed from dueDate to due_date to match database schema
  priority: 'low' | 'medium' | 'high';
}

export const useSendTodosToMentees = (coachId: string) => {
  const { mentees } = useMentees();
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([{
    id: '1',
    title: '',
    description: '',
    due_date: '', // Changed from dueDate to due_date
    priority: 'medium'
  }]);
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTodo = () => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: '',
      description: '',
      due_date: '', // Changed from dueDate to due_date
      priority: 'medium'
    };
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (id: string) => {
    if (todos.length > 1) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const updateTodo = (id: string, field: keyof Todo, value: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, [field]: value } : todo
    ));
  };

  const toggleMenteeSelection = (menteeId: string) => {
    setSelectedMentees(prev =>
      prev.includes(menteeId)
        ? prev.filter(id => id !== menteeId)
        : [...prev, menteeId]
    );
  };

  const handleSendTodos = async () => {
    if (selectedMentees.length === 0) {
      toast({
        title: "No mentees selected",
        description: "Please select at least one mentee to send todos to.",
        variant: "destructive"
      });
      return;
    }

    const validTodos = todos.filter(todo => todo.title.trim() !== '');
    if (validTodos.length === 0) {
      toast({
        title: "No valid todos",
        description: "Please add at least one todo with a title.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First, create todos in the coach_todos table
      const todoPromises = [];
      for (const menteeId of selectedMentees) {
        for (const todo of validTodos) {
          todoPromises.push(
            supabase.from('coach_todos').insert({
              coach_id: coachId,
              mentee_id: menteeId,
              title: todo.title,
              description: todo.description || null,
              due_date: todo.due_date || null,
              priority: todo.priority,
              status: 'pending'
            }).select().single()
          );
        }
      }

      const todoResults = await Promise.all(todoPromises);
      
      // Check for errors in todo creation
      const todoErrors = todoResults.filter(result => result.error);
      if (todoErrors.length > 0) {
        throw new Error('Failed to create some todos');
      }

      // Now create assignments linking mentees to todos
      const assignmentPromises = [];
      for (const result of todoResults) {
        if (result.data) {
          assignmentPromises.push(
            supabase.from('mentee_todo_assignments').insert({
              coach_id: coachId,
              mentee_id: result.data.mentee_id,
              todo_id: result.data.id,
              status: 'pending'
            })
          );
        }
      }

      await Promise.all(assignmentPromises);

      // Notification removed (formspree disabled)

      toast({
        title: "Todos sent successfully",
        description: `${validTodos.length} todo(s) sent to ${selectedMentees.length} mentee(s).`,
      });

      // Reset form
      setTodos([{
        id: Date.now().toString(),
        title: '',
        description: '',
        due_date: '', // Changed from dueDate to due_date
        priority: 'medium'
      }]);
      setSelectedMentees([]);

    } catch (error: unknown) {
      console.error('Error sending todos:', error);
      toast({
        title: "Error",
        description: "Failed to send todos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    mentees,
    todos,
    selectedMentees,
    isSubmitting,
    addTodo,
    removeTodo,
    updateTodo,
    toggleMenteeSelection,
    handleSendTodos
  };
};
