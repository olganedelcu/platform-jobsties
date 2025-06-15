import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TodoColumn from './TodoColumn';
import AddColumnDialog from './AddColumnDialog';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_date?: string;
}

interface TodoColumnType {
  id: string;
  title: string;
  todos: TodoItem[];
}

interface TrelloTodoBoardProps {
  coachId: string;
}

const TrelloTodoBoard = ({ coachId }: TrelloTodoBoardProps) => {
  const [columns, setColumns] = useState<TodoColumnType[]>([
    {
      id: '1',
      title: 'Marketing',
      todos: [
        {
          id: '1',
          title: 'Newsletter',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: '2',
          title: 'Video Graph',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: '3',
          title: 'LinkedIn Posts',
          status: 'in_progress',
          priority: 'high',
          assigned_date: '2024-06-15'
        }
      ]
    },
    {
      id: '2',
      title: 'Customer Success',
      todos: [
        {
          id: '4',
          title: 'Onboard 30 clients in June',
          status: 'pending',
          priority: 'high'
        },
        {
          id: '5',
          title: 'Optimize and document the journey of each customer',
          status: 'pending',
          priority: 'medium'
        }
      ]
    },
    {
      id: '3',
      title: 'Product / Tech: To Do',
      todos: [
        {
          id: '6',
          title: 'Improve Coach Dashboard',
          status: 'in_progress',
          priority: 'high',
          due_date: '2024-06-15'
        },
        {
          id: '7',
          title: 'See if you qualify funnel development',
          status: 'pending',
          priority: 'medium',
          due_date: '2024-06-11'
        }
      ]
    },
    {
      id: '4',
      title: 'Done',
      todos: [
        {
          id: '8',
          title: 'Improve Track for applications of user',
          status: 'completed',
          priority: 'medium',
          due_date: '2024-06-09'
        }
      ]
    }
  ]);

  const [showAddColumn, setShowAddColumn] = useState(false);

  const addColumn = (title: string) => {
    const newColumn: TodoColumnType = {
      id: Date.now().toString(),
      title,
      todos: []
    };
    setColumns([...columns, newColumn]);
    setShowAddColumn(false);
  };

  const addTodoToColumn = (columnId: string, todo: Omit<TodoItem, 'id'>) => {
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString()
    };
    
    setColumns(columns.map(column =>
      column.id === columnId
        ? { ...column, todos: [...column.todos, newTodo] }
        : column
    ));
  };

  const updateTodo = (columnId: string, todoId: string, updates: Partial<TodoItem>) => {
    setColumns(columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            todos: column.todos.map(todo =>
              todo.id === todoId ? { ...todo, ...updates } : todo
            )
          }
        : column
    ));
  };

  const deleteTodo = (columnId: string, todoId: string) => {
    setColumns(columns.map(column =>
      column.id === columnId
        ? { ...column, todos: column.todos.filter(todo => todo.id !== todoId) }
        : column
    ));
  };

  const moveTodo = (fromColumnId: string, toColumnId: string, todoId: string) => {
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const todo = fromColumn?.todos.find(t => t.id === todoId);
    
    if (!todo) return;

    setColumns(columns.map(column => {
      if (column.id === fromColumnId) {
        return { ...column, todos: column.todos.filter(t => t.id !== todoId) };
      }
      if (column.id === toColumnId) {
        return { ...column, todos: [...column.todos, todo] };
      }
      return column;
    }));
  };

  return (
    <div className="p-6">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <TodoColumn
            key={column.id}
            column={column}
            onAddTodo={(todo) => addTodoToColumn(column.id, todo)}
            onUpdateTodo={(todoId, updates) => updateTodo(column.id, todoId, updates)}
            onDeleteTodo={(todoId) => deleteTodo(column.id, todoId)}
            onMoveTodo={moveTodo}
            allColumns={columns}
          />
        ))}
        
        <Card className="min-w-80 bg-gray-50">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              onClick={() => setShowAddColumn(true)}
              className="w-full justify-start text-gray-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another list
            </Button>
          </CardContent>
        </Card>
      </div>

      <AddColumnDialog
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={addColumn}
      />
    </div>
  );
};

export default TrelloTodoBoard;
