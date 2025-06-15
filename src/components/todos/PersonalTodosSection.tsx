
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TodoItem from '@/components/TodoItem';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  mentee_id: string;
  created_at: string;
  updated_at: string;
}

interface Mentee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface PersonalTodosSectionProps {
  todos: Todo[];
  mentees: Mentee[];
  onTodoUpdated: (todoId: string, updatedTodo: Partial<Todo>) => void;
  onTodoDeleted: (todoId: string) => void;
}

const PersonalTodosSection = ({ 
  todos, 
  mentees, 
  onTodoUpdated, 
  onTodoDeleted 
}: PersonalTodosSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">My Personal Todos</h3>
      <div className="grid gap-4">
        {todos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No personal todos yet. Add your first todo to get started!</p>
            </CardContent>
          </Card>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              mentees={mentees}
              onTodoUpdated={onTodoUpdated}
              onTodoDeleted={onTodoDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalTodosSection;
