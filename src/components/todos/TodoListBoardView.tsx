
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, User } from 'lucide-react';
import CoachAssignmentsBoard from '@/components/coach/CoachAssignmentsBoard';
import PersonalTodosBoard from '@/components/coach/PersonalTodosBoard';
import SendTodosToMentees from '@/components/coach/SendTodosToMentees';
import TodoListHeader from './TodoListHeader';

interface TodoListBoardViewProps {
  coachId: string;
  showSendToMentees: boolean;
  onViewModeChange: (mode: 'list' | 'board') => void;
  onToggleSendToMentees: () => void;
}

const TodoListBoardView = ({
  coachId,
  showSendToMentees,
  onViewModeChange,
  onToggleSendToMentees
}: TodoListBoardViewProps) => {
  return (
    <div className="space-y-6">
      <TodoListHeader
        viewMode="board"
        showSendToMentees={showSendToMentees}
        onViewModeChange={onViewModeChange}
        onToggleSendToMentees={onToggleSendToMentees}
        onShowAddForm={() => {}} // Not used in board view
      />

      {/* Send to Mentees Section */}
      {showSendToMentees && (
        <SendTodosToMentees coachId={coachId} />
      )}

      {/* Tabs for different todo views */}
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assignments to Mentees
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Todos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignments" className="mt-6">
          <CoachAssignmentsBoard coachId={coachId} />
        </TabsContent>
        
        <TabsContent value="personal" className="mt-6">
          <PersonalTodosBoard coachId={coachId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TodoListBoardView;
