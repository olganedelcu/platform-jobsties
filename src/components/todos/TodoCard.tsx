import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, ArrowRight, User } from 'lucide-react';
import EditTodoDialog from './EditTodoDialog';
import { TodoItem, TodoColumnType } from '@/types/assignmentBoard';

interface TodoCardProps {
  todo: TodoItem;
  onUpdate: (updates: Partial<TodoItem>) => void;
  onDelete: () => void;
  onMove: (todoId: string, fromColumnId: string, toColumnId: string) => void;
  allColumns: TodoColumnType[];
  currentColumnId: string;
  showCoachAssignedLabel?: boolean;
}

const TodoCard = ({
  todo,
  onUpdate,
  onDelete,
  onMove,
  allColumns,
  currentColumnId,
  showCoachAssignedLabel = false
}: TodoCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (updates: Partial<TodoItem>) => {
    onUpdate(updates);
    setShowEditDialog(false);
  };

  const otherColumns = allColumns.filter(col => col.id !== currentColumnId);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 flex-1 pr-2">{todo.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {otherColumns.map((column) => (
                <DropdownMenuItem 
                  key={column.id}
                  onClick={() => onMove(todo.id, currentColumnId, column.id)}
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
        
        {todo.description && (
          <p className="text-sm text-gray-600 mb-3">{todo.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-2">
          {showCoachAssignedLabel && (
            <Badge className="bg-purple-100 text-purple-800">
              <User className="h-3 w-3 mr-1" />
              Coach Assigned
            </Badge>
          )}
          <Badge className={getPriorityColor(todo.priority)}>
            {todo.priority}
          </Badge>
          {todo.assignedTo && (
            <Badge variant="outline">
              {todo.assignedTo}
            </Badge>
          )}
        </div>
        
        {todo.due_date && (
          <p className="text-xs text-gray-500">
            Due: {new Date(todo.due_date).toLocaleDateString()}
          </p>
        )}

        <EditTodoDialog
          todo={todo}
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onUpdate={handleEdit}
        />
      </CardContent>
    </Card>
  );
};

export default TodoCard;
