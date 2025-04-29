
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';
import { taskService } from '@/lib/supabase';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);
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
        const userTasks = await taskService.getTasks(currentUser.id);
        setTasks(userTasks);
      } catch (err: any) {
        console.error('Error loading tasks:', err);
        setError(err.message || 'Erro ao carregar tarefas');
        toast.error('Erro ao carregar tarefas');
      } finally {
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
      setLoading(true);
      const newTask = await taskService.addTask(currentUser.id, task);
      setTasks((prev) => [...prev, newTask]);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar tarefa');
      toast.error(err.message || 'Erro ao adicionar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(id, updates);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar tarefa');
      toast.error(err.message || 'Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Tarefa excluída com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir tarefa');
      toast.error(err.message || 'Erro ao excluir tarefa');
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    try {
      const updatedValue = !task.completed;
      await taskService.updateTask(id, { completed: updatedValue });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: updatedValue } : task
        )
      );
      toast.success(updatedValue ? 'Tarefa concluída!' : 'Tarefa desmarcada como concluída.');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar tarefa');
      toast.error(err.message || 'Erro ao atualizar tarefa');
    }
  };

  const postponeTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    try {
      // Postpone by 1 week
      const newDate = new Date(task.date);
      newDate.setDate(newDate.getDate() + 7);
      
      await taskService.updateTask(id, { 
        date: newDate,
        postponed: true 
      });
      
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
      
      toast.success('Tarefa adiada para a próxima semana.');
    } catch (err: any) {
      setError(err.message || 'Erro ao adiar tarefa');
      toast.error(err.message || 'Erro ao adiar tarefa');
    }
  };

  const updateTaskNotes = async (id: string, notes: string) => {
    try {
      await taskService.updateTask(id, { notes });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, notes } : task))
      );
      toast.success('Anotações salvas com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar anotações');
      toast.error(err.message || 'Erro ao salvar anotações');
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
