
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface TodoItem {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
}

interface TodoItemCardProps {
  todo: TodoItem;
  index: number;
  canRemove: boolean;
  onUpdate: (index: number, field: keyof TodoItem, value: string) => void;
  onRemove: (index: number) => void;
}

const TodoItemCard = ({ todo, index, canRemove, onUpdate, onRemove }: TodoItemCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">Todo #{index + 1}</Badge>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title *
            </label>
            <Input
              placeholder="Enter todo title"
              value={todo.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              value={todo.priority}
              onChange={(e) => onUpdate(index, 'priority', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              placeholder="Enter todo description (optional)"
              value={todo.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={todo.due_date}
              onChange={(e) => onUpdate(index, 'due_date', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItemCard;
