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
      if (!user) {
        console.log('No user found in getCurrentUser');
        return null;
      }

      // Fetch user profile information
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error(profileError.message);
      }

      return {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.email?.split('@')[0] || '',
        photoURL: profile?.avatar_url || user.user_metadata?.avatar_url,
        preferences: profile?.preferences as UserPreferences | undefined,
      } as User;
    } catch (error) {
      console.error("Error getting current user:", error);
      // Return null instead of throwing to prevent authentication loops
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
        preferences: updates.preferences as any, // Convert UserPreferences to Json
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
    const updateData = { ...updates } as any;
    
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
      
      if (data) {
        data.forEach((item) => {
          if (item.dayofweek) {
            item.dayofweek.forEach(day => {
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
              
              // Convert from database format to app format
              const scheduleItem: DailyScheduleItem = {
                id: item.id,
                startTime: item.starttime,
                endTime: item.endtime,
                title: item.title,
                description: item.description || '',
                category: item.category || '',
                dayOfWeek: item.dayofweek,
                isRecurring: item.isrecurring || false,
                color: item.color,
              };
              
              schedule[dayName].push(scheduleItem);
            });
          }
        });
      }
      
      return schedule;
    } catch (error) {
      console.error("Error getting weekly schedule:", error);
      return {};
    }
  },

  // Add schedule item
  addScheduleItem: async (userId: string, item: Omit<DailyScheduleItem, 'id'>) => {
    // Convert from app format to database format
    const itemToInsert = {
      user_id: userId,
      title: item.title,
      description: item.description,
      starttime: item.startTime,
      endtime: item.endTime,
      category: item.category,
      dayofweek: item.dayOfWeek,
      isrecurring: item.isRecurring,
      color: item.color,
    };

    const { data, error } = await supabase
      .from('schedule_items')
      .insert(itemToInsert)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Convert from database format to app format
    return {
      id: data.id,
      startTime: data.starttime,
      endTime: data.endtime,
      title: data.title,
      description: data.description || '',
      category: data.category || '',
      dayOfWeek: data.dayofweek,
      isRecurring: data.isrecurring || false,
      color: data.color,
    } as DailyScheduleItem;
  },

  // Update schedule item
  updateScheduleItem: async (itemId: string, updates: Partial<DailyScheduleItem>) => {
    // Convert from app format to database format
    const updatesToInsert: Record<string, any> = {};
    
    if (updates.title !== undefined) updatesToInsert.title = updates.title;
    if (updates.description !== undefined) updatesToInsert.description = updates.description;
    if (updates.startTime !== undefined) updatesToInsert.starttime = updates.startTime;
    if (updates.endTime !== undefined) updatesToInsert.endtime = updates.endTime;
    if (updates.category !== undefined) updatesToInsert.category = updates.category;
    if (updates.dayOfWeek !== undefined) updatesToInsert.dayofweek = updates.dayOfWeek;
    if (updates.isRecurring !== undefined) updatesToInsert.isrecurring = updates.isRecurring;
    if (updates.color !== undefined) updatesToInsert.color = updates.color;

    const { error } = await supabase
      .from('schedule_items')
      .update(updatesToInsert)
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
