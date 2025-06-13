
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MenteeTodo } from '@/services/menteeTodosService';

interface MenteeTodoFormProps {
  onAddTodo: (todo: Omit<MenteeTodo, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  menteeId: string;
}

const MenteeTodoForm = ({ onAddTodo, onCancel, menteeId }: MenteeTodoFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    onAddTodo({
      mentee_id: menteeId,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      status: 'pending',
      priority: formData.priority,
      due_date: formData.due_date || null
    });

    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Personal Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter todo title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter todo description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit">Add Todo</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MenteeTodoForm;
