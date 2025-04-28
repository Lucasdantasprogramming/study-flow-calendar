
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

// This is a mock authentication system that simulates login functionality
// In a real app, this would be connected to Firebase or another auth service

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (email.trim() === '' || password.trim() === '') {
        throw new Error('Por favor, preencha todos os campos');
      }
      
      // In a real app, we would verify credentials with a server
      // For demo, create a mock user if email contains "@"
      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }
      
      const user: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setError(null);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  
  // Mock signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (email.trim() === '' || password.trim() === '' || name.trim() === '') {
        throw new Error('Por favor, preencha todos os campos');
      }
      
      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }
      
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      
      const user: User = {
        id: `user-${Date.now()}`,
        name,
        email,
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      setError(null);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };
  
  // Mock logout function
  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
    setLoading(false);
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
