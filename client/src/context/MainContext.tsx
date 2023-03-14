import { TodoType } from "../types";
import { createContext, useState, useEffect, ReactNode } from "react";
import { Status } from "../enums";
import api from '../api';

interface MainContextInterface {
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  markComplete: (id: string) => void;
  delTodo: (id: string) => void;
  editTodo: (id: string, name: string, deadline: string) => void;
  addTodo: (name: string, deadline: string) => void;
  moveTodo: (old: number, new_: number) => void;
}

interface Props {
  children: ReactNode;
}

export const MainContext = createContext<MainContextInterface | null>(null);

export const MainProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<TodoType[]>(
    JSON.parse(localStorage.getItem("todos")!) || []
  );

  useEffect(() => {
    fetchAllTodo();
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const fetchAllTodo = async () => {
    try {
      const response = await api.get('/todos');
      const todoList = response.data;
      setTodos(todoList);
    } catch (error) {
      // Handle error message
      console.error('error', error)
    }
  };

  const addTodo = async (name: string, deadline: string) => {
    if (name.trim()) {
      try {
        await api.post('/todos', {
          task: name.trim(),
          deadline: new Date(deadline).getTime()
        });
        fetchAllTodo();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const editTodo: (id: string, name: string, deadline: string) => void = async (
    id: string,
    name: string,
    deadline: string
  ) => {
    try {
      await api.patch(`/todos/${id}`, {
        task: name.trim(),
        deadline: new Date(deadline).getTime()
      });

      fetchAllTodo();
    } catch (error) {
      console.error(error);
    }
  };
  const markComplete = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    const newTaskStatus = todo?.taskStatus === Status.DONE ? Status.IN_PROGRESS : Status.DONE;
    try {
      await api.patch(`/todos/${id}`, {
        taskStatus: newTaskStatus
      });

      const updatedTodoList = todos.map((todo) => {
        if (todo.id === id) {
          todo.taskStatus = newTaskStatus
        }
        return todo;
      })

      setTodos(updatedTodoList);
    } catch (error) {
      console.error(error);
    }
  };

  const delTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchAllTodo();
    } catch (error) {
      console.error(error);
    }
  }

  const moveTodo = (old: number, new_: number) => {
    const copy = JSON.parse(JSON.stringify(todos));
    const thing = JSON.parse(JSON.stringify(todos[old]));
    copy.splice(old, 1);
    copy.splice(new_, 0, thing);
    setTodos(copy);
  };

  // const orderByDeadline = (todos: TodoType[]) => {
  //   todos.sort((x, y) => new Date(x.deadline).valueOf() - new Date(y.deadline).valueOf());
  // };

  const mainContextValue: MainContextInterface = {
    todos,
    setTodos,
    markComplete,
    delTodo,
    editTodo,
    addTodo,
    moveTodo,
  };

  return (
    <MainContext.Provider value={mainContextValue}>
      {children}
    </MainContext.Provider>
  );
};
