
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
      <DialogContent className="sm:max-w-md border-indigo-200">
        <DialogHeader>
          <DialogTitle className="text-indigo-900">Start New Conversation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject" className="text-indigo-700">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What would you like to discuss?"
              required
              disabled={creating}
              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-indigo-700">Initial Message (Optional)</Label>
            <Textarea
              id="message"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Start your conversation..."
              rows={3}
              disabled={creating}
              className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={creating || !subject.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {creating ? 'Creating...' : 'Create Conversation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
