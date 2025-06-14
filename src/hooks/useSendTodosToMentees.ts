
import { useState } from 'react';
import { useMentees } from '@/hooks/useMentees';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { NotificationHandlers } from '@/utils/anaNotificationUtils';

interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export const useSendTodosToMentees = (coachId: string) => {
  const { mentees } = useMentees();
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([{
    id: '1',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  }]);
  const [selectedMentees, setSelectedMentees] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTodo = () => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: '',
      description: '',
      dueDate: '',
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

      // Create todos for each selected mentee
      const todoPromises = [];
      for (const menteeId of selectedMentees) {
        for (const todo of validTodos) {
          todoPromises.push(
            supabase.from('mentee_todo_assignments').insert({
              coach_id: coachId,
              mentee_id: menteeId,
              title: todo.title,
              description: todo.description || null,
              due_date: todo.dueDate || null,
              priority: todo.priority,
              status: 'pending'
            })
          );
        }
      }

      await Promise.all(todoPromises);

      // Send notifications if Ana is the one sending todos
      if (user?.email) {
        const firstTodoTitle = validTodos[0]?.title;
        await NotificationHandlers.todoAssignment(
          user.email,
          selectedMentees,
          firstTodoTitle,
          validTodos.length
        );
      }

      toast({
        title: "Todos sent successfully",
        description: `${validTodos.length} todo(s) sent to ${selectedMentees.length} mentee(s).`,
      });

      // Reset form
      setTodos([{
        id: Date.now().toString(),
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      }]);
      setSelectedMentees([]);

    } catch (error: any) {
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
