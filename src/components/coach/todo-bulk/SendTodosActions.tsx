
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SendTodosActionsProps {
  isSubmitting: boolean;
  todoCount: number;
  selectedMenteeCount: number;
  onSend: () => void;
}

const SendTodosActions = ({ isSubmitting, todoCount, selectedMenteeCount, onSend }: SendTodosActionsProps) => {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onSend}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? 'Sending...' : `Send ${todoCount} Todo(s) to ${selectedMenteeCount} Mentee(s)`}
      </Button>
    </div>
  );
};

export default SendTodosActions;
