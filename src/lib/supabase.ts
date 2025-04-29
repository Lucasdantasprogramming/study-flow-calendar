import { createClient } from '@supabase/supabase-js';
import type { User, UserPreferences, Task, DailyScheduleItem, WeeklySchedule } from '@/types';

// These would be stored as environment variables in a real app
// For Lovable, we need to use them directly
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication services
export const authService = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch user profile information
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.email?.split('@')[0] || '',
      photoURL: profile?.avatar_url || user.user_metadata?.avatar_url,
      preferences: profile?.preferences as UserPreferences | undefined,
    } as User;
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Login with Google
  loginWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Sign up
  signup: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) throw new Error(error.message);
    
    // Create a profile for the new user
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email: email,
        created_at: new Date().toISOString(),
      });
    }
    
    return data;
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // Update user profile
  updateProfile: async (id: string, updates: Partial<User>) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        avatar_url: updates.photoURL,
        preferences: updates.preferences,
      })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  },
};

// Task services
export const taskService = {
  // Get all tasks for a user
  getTasks: async (userId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) throw new Error(error.message);
    
    // Convert dates back to Date objects
    return data.map(task => ({
      ...task,
      date: new Date(task.date),
    })) as Task[];
  },

  // Add new task
  addTask: async (userId: string, task: Omit<Task, 'id'>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        user_id: userId,
        date: task.date.toISOString(),
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    return {
      ...data,
      date: new Date(data.date),
    } as Task;
  },

  // Update task
  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const updateData = { ...updates };
    
    // Convert date to ISO string if it exists
    if (updateData.date instanceof Date) {
      updateData.date = updateData.date.toISOString();
    }
    
    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId);
    
    if (error) throw new Error(error.message);
    return true;
  },

  // Delete task
  deleteTask: async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw new Error(error.message);
    return true;
  },
};

// Schedule services
export const scheduleService = {
  // Get user's weekly schedule
  getWeeklySchedule: async (userId: string): Promise<WeeklySchedule> => {
    const { data, error } = await supabase
      .from('schedule_items')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    
    // Group by day of week
    const schedule: WeeklySchedule = {};
    
    data.forEach((item: DailyScheduleItem & { user_id: string }) => {
      if (item.dayOfWeek) {
        item.dayOfWeek.forEach(day => {
          if (!schedule[day]) {
            schedule[day] = [];
          }
          
          const { user_id, ...scheduleItem } = item;
          schedule[day].push(scheduleItem as DailyScheduleItem);
        });
      }
    });
    
    return schedule;
  },

  // Add schedule item
  addScheduleItem: async (userId: string, item: Omit<DailyScheduleItem, 'id'>) => {
    const { data, error } = await supabase
      .from('schedule_items')
      .insert({
        ...item,
        user_id: userId,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as DailyScheduleItem;
  },

  // Update schedule item
  updateScheduleItem: async (itemId: string, updates: Partial<DailyScheduleItem>) => {
    const { error } = await supabase
      .from('schedule_items')
      .update(updates)
      .eq('id', itemId);
    
    if (error) throw new Error(error.message);
    return true;
  },

  // Delete schedule item
  deleteScheduleItem: async (itemId: string) => {
    const { error } = await supabase
      .from('schedule_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw new Error(error.message);
    return true;
  },
};
