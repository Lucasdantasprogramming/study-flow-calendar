
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import { ScheduleProvider } from "./context/ScheduleContext";
import { ThemeProvider } from "./hooks/use-theme";
import { useMockData } from "@/lib/environment";
import { SupabaseWarning } from "@/components/misc/SupabaseWarning";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SchedulePage from "./pages/SchedulePage";
import NotesPage from "./pages/NotesPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import { PublicRoute } from "./components/auth/PublicRoute";
import AuthCallback from "./components/auth/AuthCallback";

const queryClient = new QueryClient();

const App = () => {
  const showMockWarning = useMockData;
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <TasksProvider>
                <ScheduleProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* Protected routes */}
                    <Route path="/dashboard" element={<Index />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* 404 catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  {showMockWarning && <SupabaseWarning />}
                </ScheduleProvider>
              </TasksProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
