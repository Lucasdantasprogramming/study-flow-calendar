
// Check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Check if Supabase credentials are available
export const hasSupabaseCredentials = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY && 
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key';

// Whether we should use mock data instead of real Supabase data
export const useMockData = isDevelopment && !hasSupabaseCredentials;
