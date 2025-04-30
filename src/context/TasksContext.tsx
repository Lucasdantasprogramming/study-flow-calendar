
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';
import { taskService } from '@/lib/supabase';
import { toast } from 'sonner';
import { useMockData } from '@/lib/environment';
import { mockTasks } from '@/lib/mockData';

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  postponeTask: (id: string) => Promise<void>;
  updateTaskNotes: (id: string, notes: string) => Promise<void>;
  getTasksByDate: (date: Date) => Task[];
  loading: boolean;
  error: string | null;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Load tasks when user changes
  useEffect(() => {
    const loadTasks = async () => {
      if (!currentUser) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        if (useMockData) {
          console.log('Using mock task data in development mode');
          setTasks(mockTasks);
          // Guarantee that the loading state is properly reset even with mock data
          setTimeout(() => setLoading(false), 300);
          return;
        }
        
        const userTasks = await taskService.getTasks(currentUser.id);
        setTasks(userTasks);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading tasks:', err);
        setError(err.message || 'Erro ao carregar tarefas');
        toast.error('Erro ao carregar tarefas');
        // Guarantee that the loading state is properly reset even with error
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentUser]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para adicionar tarefas');
      return;
    }
    
    try {
      const tempId = `temp-${Date.now()}`;
      
      // Optimistic update
      const tempTask: Task = {
        id: tempId,
        ...task
      };
      
      setTasks((prev) => [...prev, tempTask]);
      
      if (useMockData) {
        // Generate a mock task with ID for development
        toast.success('Tarefa adicionada com sucesso!');
        return;
      }
      
      const newTask = await taskService.addTask(currentUser.id, task);
      
      // Replace temp task with real task from server
      setTasks((prev) => prev.map(t => t.id === tempId ? newTask : t));
      
      toast.success('Tarefa adicionada com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar tarefa');
      toast.error(err.message || 'Erro ao adicionar tarefa');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
      
      if (useMockData) {
        // Update mock task in development mode
        return;
      }
      
      await taskService.updateTask(id, updates);
    } catch (err: any) {
      // Revert optimistic update on error
      setError(err.message || 'Erro ao atualizar tarefa');
      toast.error(err.message || 'Erro ao atualizar tarefa');
      
      // Reload tasks if update fails to ensure UI is in sync with server
      if (currentUser) {
        const userTasks = await taskService.getTasks(currentUser.id);
        setTasks(userTasks);
      }
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // Optimistic update
      setTasks((prev) => prev.filter((task) => task.id !== id));
      
      if (useMockData) {
        // Delete mock task in development mode
        toast.success('Tarefa excluída com sucesso!');
        return;
      }
      
      await taskService.deleteTask(id);
      toast.success('Tarefa excluída com sucesso!');
    } catch (err: any) {
      // Revert optimistic update on error
      setError(err.message || 'Erro ao excluir tarefa');
      toast.error(err.message || 'Erro ao excluir tarefa');
      
      // Reload tasks if delete fails to ensure UI is in sync with server
      if (currentUser) {
        const userTasks = await taskService.getTasks(currentUser.id);
        setTasks(userTasks);
      }
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    try {
      const updatedValue = !task.completed;
      
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: updatedValue } : task
        )
      );
      
      if (useMockData) {
        // Update mock task completion status in development mode
        toast.success(updatedValue ? 'Tarefa concluída!' : 'Tarefa desmarcada como concluída.');
        return;
      }
      
      await taskService.updateTask(id, { completed: updatedValue });
      toast.success(updatedValue ? 'Tarefa concluída!' : 'Tarefa desmarcada como concluída.');
    } catch (err: any) {
      // Revert optimistic update on error
      setError(err.message || 'Erro ao atualizar tarefa');
      toast.error(err.message || 'Erro ao atualizar tarefa');
      
      // Reload tasks if update fails to ensure UI is in sync with server
      if (currentUser) {
        const userTasks = await taskService.getTasks(currentUser.id);
        setTasks(userTasks);
      }
    }
  };

  const postponeTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    try {
      // Postpone by 1 week
      const newDate = new Date(task.date);
      newDate.setDate(newDate.getDate() + 7);
      
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              date: newDate,
              postponed: true,
            };
          }
          return task;
        })
      );
      
      if (useMockData) {
        // Update mock task date in development mode
        toast.success('Tarefa adiada para a próxima semana.');
        return;
      }
      
      await taskService.updateTask(id, { 
        date: newDate,
        postponed: true 
      });
      
      toast.success('Tarefa adiada para a próxima semana.');
    } catch (err: any) {
      // Revert optimistic update on error
      setError(err.message || 'Erro ao adiar tarefa');
      toast.error(err.message || 'Erro ao adiar tarefa');
      
      // Reload tasks if update fails to ensure UI is in sync with server
      if (currentUser) {
        const userTasks = await taskService.getTasks(currentUser.id);
        setTasks(userTasks);
      }
    }
  };

  const updateTaskNotes = async (id: string, notes: string) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, notes } : task))
      );
      
      if (useMockData) {
        // Update mock task notes in development mode
        toast.success('Anotações salvas com sucesso!');
        return;
      }
      
      await taskService.updateTask(id, { notes });
      toast.success('Anotações salvas com sucesso!');
    } catch (err: any) {
      // Revert optimistic update on error
      setError(err.message || 'Erro ao salvar anotações');
      toast.error(err.message || 'Erro ao salvar anotações');
      
      // Reload tasks if update fails to ensure UI is in sync with server
      if (currentUser) {
        const userTasks = await taskService.getTasks(currentUser.id);
        setTasks(userTasks);
      }
    }
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
    error
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
