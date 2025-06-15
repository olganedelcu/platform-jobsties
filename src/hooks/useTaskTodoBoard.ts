
import { useState } from 'react';

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

export const useTaskTodoBoard = (coachId: string) => {
  const [columns, setColumns] = useState<TodoColumnType[]>([
    {
      id: '1',
      title: 'Pending',
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
        }
      ]
    },
    {
      id: '2',
      title: 'In Progress',
      todos: [
        {
          id: '3',
          title: 'LinkedIn Posts',
          status: 'in_progress',
          priority: 'high',
          assigned_date: '2024-06-15'
        },
        {
          id: '4',
          title: 'Onboard 30 clients in June',
          status: 'in_progress',
          priority: 'high'
        }
      ]
    },
    {
      id: '3',
      title: 'Done',
      todos: [
        {
          id: '5',
          title: 'Improve Track for applications of user',
          status: 'completed',
          priority: 'medium',
          due_date: '2024-06-09'
        }
      ]
    }
  ]);

  const addColumn = (title: string) => {
    const newColumn: TodoColumnType = {
      id: Date.now().toString(),
      title,
      todos: []
    };
    setColumns([...columns, newColumn]);
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

    // Update todo status based on the destination column
    let newStatus: 'pending' | 'in_progress' | 'completed' = todo.status;
    const toColumn = columns.find(col => col.id === toColumnId);
    if (toColumn) {
      if (toColumn.title === 'Pending') newStatus = 'pending';
      else if (toColumn.title === 'In Progress') newStatus = 'in_progress';  
      else if (toColumn.title === 'Done') newStatus = 'completed';
    }

    const updatedTodo = { ...todo, status: newStatus };

    setColumns(columns.map(column => {
      if (column.id === fromColumnId) {
        return { ...column, todos: column.todos.filter(t => t.id !== todoId) };
      }
      if (column.id === toColumnId) {
        return { ...column, todos: [...column.todos, updatedTodo] };
      }
      return column;
    }));
  };

  return {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  };
};
