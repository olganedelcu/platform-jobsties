
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useSendTodosToMentees } from '@/hooks/useSendTodosToMentees';
import MenteeMultiSelector from './MenteeMultiSelector';
import TodoListSection from './todo-bulk/TodoListSection';
import SendTodosActions from './todo-bulk/SendTodosActions';

interface SendTodosToMenteesProps {
  coachId: string;
}

const SendTodosToMentees = ({ coachId }: SendTodosToMenteesProps) => {
  const {
    todos,
    selectedMentees,
    isSubmitting,
    addTodo,
    removeTodo,
    updateTodo,
    toggleMenteeSelection,
    handleSendTodos
  } = useSendTodosToMentees(coachId);

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
        <TodoListSection
          todos={todos}
          onAddTodo={addTodo}
          onUpdateTodo={updateTodo}
          onRemoveTodo={removeTodo}
        />

        {/* Send Button */}
        <SendTodosActions
          isSubmitting={isSubmitting}
          todoCount={todos.length}
          selectedMenteeCount={selectedMentees.length}
          onSend={handleSendTodos}
        />
      </CardContent>
    </Card>
  );
};

export default SendTodosToMentees;
