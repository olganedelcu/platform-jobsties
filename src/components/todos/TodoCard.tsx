
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, ArrowRight, User, ExternalLink } from 'lucide-react';
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

  // Function to detect and convert URLs to clickable links
  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return (
      <div className="space-y-2">
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <div key={index} className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3 text-blue-600 flex-shrink-0" />
                <a
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {part}
                </a>
              </div>
            );
          }
          return part ? (
            <span key={index} className="block text-sm text-gray-600 leading-relaxed">
              {part}
            </span>
          ) : null;
        })}
      </div>
    );
  };

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

  const handleMoveToStatus = (targetStatus: 'pending' | 'in_progress' | 'completed') => {
    // Find the column that represents this status
    const targetColumn = allColumns.find(col => {
      const columnTitle = col.title.toLowerCase();
      if (targetStatus === 'pending') return columnTitle.includes('pending');
      if (targetStatus === 'in_progress') return columnTitle.includes('progress');
      if (targetStatus === 'completed') return columnTitle.includes('completed') || columnTitle.includes('done');
      return false;
    });

    if (targetColumn && targetColumn.id !== currentColumnId) {
      onMove(todo.id, currentColumnId, targetColumn.id);
    }
  };

  const otherColumns = allColumns.filter(col => col.id !== currentColumnId);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h4 className="font-semibold text-gray-900 flex-1 pr-3 text-lg leading-relaxed">{todo.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              
              {todo.status !== 'pending' && (
                <DropdownMenuItem onClick={() => handleMoveToStatus('pending')}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Move to Pending
                </DropdownMenuItem>
              )}
              
              {todo.status !== 'in_progress' && (
                <DropdownMenuItem onClick={() => handleMoveToStatus('in_progress')}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Move to In Progress
                </DropdownMenuItem>
              )}
              
              {todo.status !== 'completed' && (
                <DropdownMenuItem onClick={() => handleMoveToStatus('completed')}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Move to Completed
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {todo.description && (
          <div className="mb-6 p-5 bg-gray-50 rounded-xl min-h-[120px] border-l-4 border-blue-200">
            <div className="text-sm font-medium text-gray-700 mb-3">Description:</div>
            <div className="space-y-3">
              {renderTextWithLinks(todo.description)}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 mb-4">
          {showCoachAssignedLabel && (
            <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
              <User className="h-3 w-3 mr-1" />
              Coach Assigned
            </Badge>
          )}
          <Badge className={`${getPriorityColor(todo.priority)} px-3 py-1`}>
            {todo.priority} priority
          </Badge>
          {todo.assignedTo && (
            <Badge variant="outline" className="px-3 py-1">
              {todo.assignedTo}
            </Badge>
          )}
        </div>
        
        {todo.due_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="font-medium">Due:</span>
            <span>{new Date(todo.due_date).toLocaleDateString()}</span>
          </div>
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
