
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createTodoAssignments } from '@/services/todoAssignmentService';
import MenteeMultiSelector from './MenteeMultiSelector';

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
      // Create todos in coach_todos table and assignments for each mentee
      for (const todo of todos) {
        // Create the todo first
        const { data: todoData, error: todoError } = await supabase
          .from('coach_todos')
          .insert({
            coach_id: coachId,
            title: todo.title.trim(),
            description: todo.description.trim() || null,
            priority: todo.priority,
            due_date: todo.due_date || null,
            mentee_id: selectedMentees[0] // Required field, use first mentee
          })
          .select()
          .single();

        if (todoError) throw todoError;

        // Create assignments for all selected mentees
        await createTodoAssignments(coachId, todoData.id, selectedMentees);
      }

      toast({
        title: "Success",
        description: `${todos.length} todo(s) sent to ${selectedMentees.length} mentee(s)`,
      });

      // Reset form
      setTodos([{ title: '', description: '', priority: 'medium', due_date: '' }]);
      setSelectedMentees([]);
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Todo Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTodo}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Todo
            </Button>
          </div>

          {todos.map((todo, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Todo #{index + 1}</Badge>
                  {todos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTodo(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title *
                    </label>
                    <Input
                      placeholder="Enter todo title"
                      value={todo.title}
                      onChange={(e) => updateTodo(index, 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <select
                      value={todo.priority}
                      onChange={(e) => updateTodo(index, 'priority', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      placeholder="Enter todo description (optional)"
                      value={todo.description}
                      onChange={(e) => updateTodo(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={todo.due_date}
                      onChange={(e) => updateTodo(index, 'due_date', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSendTodos}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending...' : `Send ${todos.length} Todo(s) to ${selectedMentees.length} Mentee(s)`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SendTodosToMentees;
