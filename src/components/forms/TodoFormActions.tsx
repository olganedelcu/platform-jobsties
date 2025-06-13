
import React from 'react';
import { Button } from '@/components/ui/button';

interface TodoFormActionsProps {
  onAddTodo: () => void;
  onCancel: () => void;
}

const TodoFormActions = ({ onAddTodo, onCancel }: TodoFormActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button onClick={onAddTodo}>Add Todo</Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default TodoFormActions;
