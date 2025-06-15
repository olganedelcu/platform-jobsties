
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddColumnDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
}

const AddColumnDialog = ({ open, onClose, onAdd }: AddColumnDialogProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter list title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add List
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnDialog;
