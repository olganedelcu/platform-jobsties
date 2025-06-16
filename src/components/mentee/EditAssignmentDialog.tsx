
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TodoAssignmentWithDetails } from '@/services/todoAssignmentService';

interface EditAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  assignment: TodoAssignmentWithDetails;
  onUpdate: (details: {
    mentee_title?: string;
    mentee_description?: string;
    mentee_due_date?: string;
    mentee_priority?: 'low' | 'medium' | 'high';
  }) => void;
}

const EditAssignmentDialog = ({ open, onClose, assignment, onUpdate }: EditAssignmentDialogProps) => {
  const [formData, setFormData] = useState({
    title: assignment.mentee_title || assignment.todo?.title || '',
    description: assignment.mentee_description || assignment.todo?.description || '',
    due_date: assignment.mentee_due_date || assignment.todo?.due_date || '',
    priority: assignment.mentee_priority || assignment.todo?.priority || 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    setFormData({
      title: assignment.mentee_title || assignment.todo?.title || '',
      description: assignment.mentee_description || assignment.todo?.description || '',
      due_date: assignment.mentee_due_date || assignment.todo?.due_date || '',
      priority: assignment.mentee_priority || assignment.todo?.priority || 'medium'
    });
  }, [assignment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onUpdate({
        mentee_title: formData.title.trim(),
        mentee_description: formData.description?.trim() || undefined,
        mentee_due_date: formData.due_date || undefined,
        mentee_priority: formData.priority
      });
      onClose();
    }
  };

  const hasChanges = () => {
    const originalTitle = assignment.mentee_title || assignment.todo?.title || '';
    const originalDescription = assignment.mentee_description || assignment.todo?.description || '';
    const originalDueDate = assignment.mentee_due_date || assignment.todo?.due_date || '';
    const originalPriority = assignment.mentee_priority || assignment.todo?.priority || 'medium';

    return (
      formData.title !== originalTitle ||
      formData.description !== originalDescription ||
      formData.due_date !== originalDueDate ||
      formData.priority !== originalPriority
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Assignment Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter assignment title..."
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
            <Button type="submit" disabled={!formData.title.trim() || !hasChanges()}>
              Update Assignment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAssignmentDialog;
