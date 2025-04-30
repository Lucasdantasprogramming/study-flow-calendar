import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { authService, supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useMockData } from '@/lib/environment';
import { mockCurrentUser } from '@/lib/mockData';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on mount - modified to prevent infinite loops
  useEffect(() => {
    const checkUser = async () => {
      try {
        if (useMockData) {
          console.log('Using mock user data in development mode');
          setCurrentUser(mockCurrentUser);
          setLoading(false);
          setAuthChecked(true);
          return;
        }

        console.log('Checking authentication status...');
        const user = await authService.getCurrentUser();
        console.log('Auth check complete', user ? 'User found' : 'No user');
        setCurrentUser(user);
      } catch (err) {
        console.error('Error checking authentication status:', err);
        setError('Erro ao verificar autenticação');
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };
    
    if (!authChecked) {
      checkUser();
    }
    
    // Set up auth state listener
    if (!useMockData) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            try {
              setLoading(true);
              const user = await authService.getCurrentUser();
              setCurrentUser(user);
            } catch (err) {
              console.error('Error getting user after auth change:', err);
            } finally {
              setLoading(false);
            }
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setLoading(false);
          }
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, [authChecked]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        // Simulate login in development mode
        setTimeout(() => {
          setCurrentUser(mockCurrentUser);
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }, 800);
        return;
      }
      
      await authService.login(email, password);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      toast.error(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        // Simulate Google login in development mode
        setTimeout(() => {
          setCurrentUser(mockCurrentUser);
          toast.success('Login com Google realizado com sucesso!');
          navigate('/');
        }, 800);
        return;
      }
      
      await authService.loginWithGoogle();
      // Auth state listener will handle setting the user
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google');
      toast.error(err.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        // Simulate signup in development mode
        setTimeout(() => {
          toast.success('Conta criada com sucesso! Por favor, verifique seu email.');
          navigate('/login');
        }, 800);
        return;
      }
      
      await authService.signup(email, password, name);
      toast.success('Conta criada com sucesso! Por favor, verifique seu email.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      toast.error(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      
      if (useMockData) {
        // Simulate logout in development mode
        setTimeout(() => {
          setCurrentUser(null);
          toast.success('Logout realizado com sucesso!');
          navigate('/login');
        }, 500);
        return;
      }
      
      await authService.logout();
      setCurrentUser(null);
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer logout');
      toast.error(err.message || 'Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (useMockData) {
        // Simulate profile update in development mode
        setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
        toast.success('Perfil atualizado com sucesso!');
        return;
      }
      
      if (!currentUser?.id) return;
      await authService.updateProfile(currentUser.id, updates);
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
      toast.error(err.message || 'Erro ao atualizar perfil');
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateProfile,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
