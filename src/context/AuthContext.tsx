
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { authService, supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error checking authentication status:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
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
