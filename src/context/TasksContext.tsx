
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { useAuth } from './AuthContext';
import { format, addWeeks } from 'date-fns';

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  postponeTask: (id: string) => void;
  updateTaskNotes: (id: string, notes: string) => void;
  getTasksByDate: (date: Date) => Task[];
  loading: boolean;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider = ({ children }: TasksProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load tasks from localStorage on mount and when user changes
  useEffect(() => {
    if (currentUser) {
      const storedTasks = localStorage.getItem(`tasks-${currentUser.id}`);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          date: new Date(task.date),
        }));
        setTasks(parsedTasks);
      } else if (tasks.length === 0) {
        // If no tasks in storage and current task list is empty, create sample tasks
        createSampleTasks();
      }
    } else {
      setTasks([]);
    }
    setLoading(false);
  }, [currentUser]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (currentUser && tasks.length > 0) {
      localStorage.setItem(`tasks-${currentUser.id}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  const createSampleTasks = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Álgebra Linear',
        description: 'Estudar matrizes e determinantes',
        date: today,
        completed: false,
        postponed: false,
        notes: '',
      },
      {
        id: '2',
        title: 'Física Quântica',
        description: 'Revisar equação de Schrödinger',
        date: today,
        completed: false,
        postponed: false,
        notes: '',
      },
      {
        id: '3',
        title: 'Literatura Brasileira',
        description: 'Ler Machado de Assis - Dom Casmurro',
        date: tomorrow,
        completed: false,
        postponed: false,
        notes: '',
      },
    ];
    
    setTasks(sampleTasks);
    if (currentUser) {
      localStorage.setItem(`tasks-${currentUser.id}`, JSON.stringify(sampleTasks));
    }
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const postponeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          // Postpone by 1 week
          const newDate = addWeeks(new Date(task.date), 1);
          return {
            ...task,
            date: newDate,
            postponed: true,
          };
        }
        return task;
      })
    );
  };

  const updateTaskNotes = (id: string, notes: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, notes } : task))
    );
  };

  const getTasksByDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return tasks.filter(
      (task) => format(new Date(task.date), 'yyyy-MM-dd') === dateString
    );
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    postponeTask,
    updateTaskNotes,
    getTasksByDate,
    loading,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
