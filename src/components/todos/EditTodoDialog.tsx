
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_date?: string;
}

interface EditTodoDialogProps {
  open: boolean;
  onClose: () => void;
  todo: TodoItem;
  onUpdate: (updates: Partial<TodoItem>) => void;
}

const EditTodoDialog = ({ open, onClose, todo, onUpdate }: EditTodoDialogProps) => {
  const [formData, setFormData] = useState({
    title: todo.title,
    description: todo.description || '',
    status: todo.status,
    priority: todo.priority,
    due_date: todo.due_date || '',
    assigned_date: todo.assigned_date || ''
  });

  useEffect(() => {
    setFormData({
      title: todo.title,
      description: todo.description || '',
      status: todo.status,
      priority: todo.priority,
      due_date: todo.due_date || '',
      assigned_date: todo.assigned_date || ''
    });
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onUpdate({
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        assigned_date: formData.assigned_date || undefined
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter todo title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description (optional)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'pending' | 'in_progress' | 'completed' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assigned_date">Assigned Date</Label>
              <Input
                id="assigned_date"
                type="date"
                value={formData.assigned_date}
                onChange={(e) => setFormData({ ...formData, assigned_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              Update Todo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoDialog;
