
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConversation: (subject: string, initialMessage?: string) => void;
  creating?: boolean;
}

const NewConversationDialog = ({
  open,
  onOpenChange,
  onCreateConversation,
  creating = false
}: NewConversationDialogProps) => {
  const [subject, setSubject] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    onCreateConversation(subject.trim(), initialMessage.trim() || undefined);
    setSubject('');
    setInitialMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What would you like to discuss?"
              required
              disabled={creating}
            />
          </div>
          <div>
            <Label htmlFor="message">Initial Message (Optional)</Label>
            <Textarea
              id="message"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Start your conversation..."
              rows={3}
              disabled={creating}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating || !subject.trim()}>
              {creating ? 'Creating...' : 'Create Conversation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
