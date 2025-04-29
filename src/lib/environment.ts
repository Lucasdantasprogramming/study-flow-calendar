
// Check if we're in development mode
export const isDevelopment = import.meta.env.DEV;

// Use the client from the integrations folder that's already properly configured
export const hasSupabaseCredentials = true;

// Whether we should use mock data instead of real Supabase data
export const useMockData = isDevelopment && !hasSupabaseCredentials;
