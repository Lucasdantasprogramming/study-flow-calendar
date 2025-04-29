import { createClient } from '@supabase/supabase-js';
import type { User, UserPreferences, Task, DailyScheduleItem, WeeklySchedule } from '@/types';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Use the Supabase client from integrations
export const supabase = supabaseClient;

// Authentication services
export const authService = {
  // Get current user
  getCurrentUser: async () => {
    try {
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
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
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
    try {
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
    } catch (error) {
      console.error("Error getting tasks:", error);
      return [];
    }
  },

  // Add new task
  addTask: async (userId: string, task: Omit<Task, 'id'>) => {
    // Make sure date is a string when sending to Supabase
    const taskToInsert = {
      ...task,
      user_id: userId,
      date: task.date instanceof Date ? task.date.toISOString() : task.date,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskToInsert)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Convert back to Date object when returning
    return {
      ...data,
      date: new Date(data.date),
    } as Task;
  },

  // Update task
  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const updateData = { ...updates };
    
    // Convert date to ISO string if it exists and is a Date object
    if (updateData.date instanceof Date) {
      updateData.date = updateData.date.toISOString();
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Convert date back to Date object when returning
    if (data) {
      return {
        ...data,
        date: new Date(data.date),
      } as Task;
    }
    
    return null; // Return null if no data was returned
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
    try {
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
            // Convert day number to day name in Portuguese
            let dayName: string;
            switch (day) {
              case 0: dayName = 'domingo'; break;
              case 1: dayName = 'segunda'; break;
              case 2: dayName = 'terça'; break;
              case 3: dayName = 'quarta'; break;
              case 4: dayName = 'quinta'; break;
              case 5: dayName = 'sexta'; break;
              case 6: dayName = 'sábado'; break;
              default: dayName = 'domingo';
            }
            
            if (!schedule[dayName]) {
              schedule[dayName] = [];
            }
            
            const { user_id, ...scheduleItem } = item;
            schedule[dayName].push(scheduleItem as DailyScheduleItem);
          });
        }
      });
      
      return schedule;
    } catch (error) {
      console.error("Error getting weekly schedule:", error);
      return {};
    }
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
