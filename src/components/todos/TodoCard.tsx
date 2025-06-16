
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit2, Trash2, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditTodoDialog from './EditTodoDialog';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_date?: string;
  assignedTo?: string;
}

interface TodoColumn {
  id: string;
  title: string;
  todos: TodoItem[];
}

interface TodoCardProps {
  todo: TodoItem;
  onUpdate: (updates: Partial<TodoItem>) => void;
  onDelete: () => void;
  onMove: (toColumnId: string) => void;
  allColumns: TodoColumn[];
}

const TodoCard = ({ todo, onUpdate, onDelete, onMove, allColumns }: TodoCardProps) => {
  const [showEdit, setShowEdit] = useState(false);

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
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && todo.status !== 'completed';
  };

  // Handle double-click to edit
  const handleDoubleClick = () => {
    setShowEdit(true);
  };

  return (
    <>
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onDoubleClick={handleDoubleClick}>
        <CardContent className="p-3">
          <div className="flex items-start gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(todo.status)}`} />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 leading-tight">
                {todo.title}
              </h4>
              {todo.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {todo.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEdit(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {allColumns.map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    onClick={() => onMove(column.id)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Move to {column.title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(todo.priority)}`}>
                {todo.priority}
              </Badge>
              
              {todo.due_date && (
                <div className={`flex items-center gap-1 text-xs ${
                  isOverdue(todo.due_date) ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(todo.due_date)}</span>
                </div>
              )}
              
              {todo.assigned_date && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(todo.assigned_date)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Show assigned to info for assignments */}
          {todo.assignedTo && (
            <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
              <User className="h-3 w-3" />
              <span>Assigned to: {todo.assignedTo}</span>
            </div>
          )}

          {/* Hint for double-click editing */}
          <div className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Double-click to edit
          </div>
        </CardContent>
      </Card>

      <EditTodoDialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
        todo={todo}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default TodoCard;
