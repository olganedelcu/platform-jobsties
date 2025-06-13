
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Play, Calendar, Trash2 } from 'lucide-react';
import { MenteeTodo } from '@/services/menteeTodosService';

interface MenteePersonalTodosListProps {
  todos: MenteeTodo[];
  onUpdateStatus: (todoId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTodo: (todoId: string) => void;
}

const MenteePersonalTodosList = ({ todos, onUpdateStatus, onDeleteTodo }: MenteePersonalTodosListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (todos.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-500">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No personal todos yet</h3>
            <p>Create your first personal todo to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card key={todo.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {todo.title}
                  </h3>
                  <Badge className={getPriorityColor(todo.priority)}>
                    {todo.priority} priority
                  </Badge>
                  <Badge className={getStatusColor(todo.status)}>
                    {todo.status.replace('_', ' ')}
                  </Badge>
                  {todo.due_date && isOverdue(todo.due_date) && todo.status !== 'completed' && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Overdue
                    </Badge>
                  )}
                </div>

                {todo.description && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {todo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {new Date(todo.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {todo.due_date && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className={isOverdue(todo.due_date) && todo.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                        Due: {new Date(todo.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                {todo.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(todo.id, 'in_progress')}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                )}

                {todo.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(todo.id, 'completed')}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Complete
                  </Button>
                )}

                {todo.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(todo.id, 'in_progress')}
                    className="flex items-center gap-2"
                  >
                    Reopen
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteTodo(todo.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenteePersonalTodosList;
