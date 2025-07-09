
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Play, Calendar, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MenteeTodo } from '@/services/menteeTodosService';
import EditTodoDialog from '@/components/todos/EditTodoDialog';

interface MenteePersonalTodosListProps {
  todos: MenteeTodo[];
  onUpdateStatus: (todoId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteTodo: (todoId: string) => void;
  onUpdateTodo?: (todoId: string, updates: Partial<MenteeTodo>) => void;
}

const MenteePersonalTodosList = ({ 
  todos, 
  onUpdateStatus, 
  onDeleteTodo, 
  onUpdateTodo 
}: MenteePersonalTodosListProps) => {
  const [editingTodo, setEditingTodo] = useState<MenteeTodo | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (todoId: string) => {
    navigate(`/task/${todoId}`);
  };

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

  const handleEditTodo = (updates: Partial<MenteeTodo>) => {
    if (editingTodo && onUpdateTodo) {
      onUpdateTodo(editingTodo.id, updates);
    }
    setEditingTodo(null);
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {todos.map((todo) => (
          <Card 
            key={todo.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer aspect-square min-h-[280px] min-w-[280px]"
            onClick={() => handleCardClick(todo.id)}
          >
          <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge className={getPriorityColor(todo.priority)}>
                    {todo.priority}
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

                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                  {todo.title}
                </h3>

                {todo.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                    {todo.description}
                  </p>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(todo.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {todo.due_date && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className={isOverdue(todo.due_date) && todo.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                        {new Date(todo.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-1 mt-3">
                {todo.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(todo.id, 'in_progress');
                    }}
                    className="text-xs px-2 py-1"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                )}

                {todo.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(todo.id, 'completed');
                    }}
                    className="text-xs px-2 py-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                  </Button>
                )}

                {todo.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(todo.id, 'in_progress');
                    }}
                    className="text-xs px-2 py-1"
                  >
                    Reopen
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()} className="px-2 py-1">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingTodo(todo); }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); onDeleteTodo(todo.id); }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingTodo && (
        <EditTodoDialog
          open={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          todo={{
            id: editingTodo.id,
            title: editingTodo.title,
            description: editingTodo.description || undefined,
            status: editingTodo.status,
            priority: editingTodo.priority,
            due_date: editingTodo.due_date || undefined,
            assigned_date: editingTodo.created_at
          }}
          onUpdate={handleEditTodo}
        />
      )}
    </>
  );
};

export default MenteePersonalTodosList;
