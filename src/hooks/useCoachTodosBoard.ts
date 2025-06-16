
import { useCoachPersonalTodosData } from './useCoachPersonalTodosData';
import { useCoachPersonalTodosActions } from './useCoachPersonalTodosActions';

export const useCoachTodosBoard = (coachId: string) => {
  const { columns, setColumns, refreshTodos, toast } = useCoachPersonalTodosData(coachId);
  
  const {
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo
  } = useCoachPersonalTodosActions(coachId, columns, setColumns, toast);

  return {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo,
    refreshTodos
  };
};
