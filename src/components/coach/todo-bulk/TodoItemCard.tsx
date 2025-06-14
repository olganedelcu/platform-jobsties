
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
}

interface TodoItemCardProps {
  todo: TodoItem;
  index: number;
  canRemove: boolean;
  onUpdate: (id: string, field: keyof TodoItem, value: string) => void;
  onRemove: (id: string) => void;
}

const TodoItemCard = ({ todo, index, canRemove, onUpdate, onRemove }: TodoItemCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Todo {index + 1}</h4>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`title-${todo.id}`}>Title *</Label>
            <Input
              id={`title-${todo.id}`}
              value={todo.title}
              onChange={(e) => onUpdate(todo.id, 'title', e.target.value)}
              placeholder="Enter todo title"
            />
          </div>

          <div>
            <Label htmlFor={`description-${todo.id}`}>Description</Label>
            <Textarea
              id={`description-${todo.id}`}
              value={todo.description}
              onChange={(e) => onUpdate(todo.id, 'description', e.target.value)}
              placeholder="Enter todo description"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`due-date-${todo.id}`}>Due Date</Label>
              <Input
                id={`due-date-${todo.id}`}
                type="date"
                value={todo.due_date}
                onChange={(e) => onUpdate(todo.id, 'due_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor={`priority-${todo.id}`}>Priority</Label>
              <Select
                value={todo.priority}
                onValueChange={(value) => onUpdate(todo.id, 'priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItemCard;
