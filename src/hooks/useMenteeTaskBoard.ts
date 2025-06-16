
import { useMenteeTaskBoardData } from './useMenteeTaskBoardData';
import { useMenteeTaskBoardActions } from './useMenteeTaskBoardActions';

export const useMenteeTaskBoard = (userId: string) => {
  const { columns, setColumns, refetchTodos } = useMenteeTaskBoardData(userId);
  const { addColumn, addTodoToColumn, updateTodo, deleteTodo, moveTodo } = useMenteeTaskBoardActions(
    userId,
    columns,
    setColumns
  );

  return {
    columns,
    addColumn,
    addTodoToColumn,
    updateTodo,
    deleteTodo,
    moveTodo,
    refetchTodos
  };
};
