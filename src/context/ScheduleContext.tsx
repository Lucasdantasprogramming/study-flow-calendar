
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyScheduleItem } from '../types';
import { useAuth } from './AuthContext';

interface ScheduleContextType {
  scheduleItems: DailyScheduleItem[];
  addScheduleItem: (item: Omit<DailyScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, updates: Partial<DailyScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  loading: boolean;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

interface ScheduleProviderProps {
  children: ReactNode;
}

export const ScheduleProvider = ({ children }: ScheduleProviderProps) => {
  const [scheduleItems, setScheduleItems] = useState<DailyScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load schedule items from localStorage on mount and when user changes
  useEffect(() => {
    if (currentUser) {
      const storedItems = localStorage.getItem(`schedule-${currentUser.id}`);
      if (storedItems) {
        setScheduleItems(JSON.parse(storedItems));
      } else {
        // Create default schedule if none exists
        createDefaultSchedule();
      }
    } else {
      setScheduleItems([]);
    }
    setLoading(false);
  }, [currentUser]);

  // Save schedule items to localStorage whenever they change
  useEffect(() => {
    if (currentUser && scheduleItems.length > 0) {
      localStorage.setItem(`schedule-${currentUser.id}`, JSON.stringify(scheduleItems));
    }
  }, [scheduleItems, currentUser]);

  const createDefaultSchedule = () => {
    const defaultItems: DailyScheduleItem[] = [
      {
        id: '1',
        startTime: '08:00',
        endTime: '09:30',
        title: 'Matemática',
        description: 'Revisão de cálculo diferencial',
        category: 'study',
      },
      {
        id: '2',
        startTime: '09:45',
        endTime: '11:15',
        title: 'Física',
        description: 'Estudo de mecânica quântica',
        category: 'study',
      },
      {
        id: '3',
        startTime: '11:30',
        endTime: '12:30',
        title: 'Almoço',
        description: 'Pausa para refeição e descanso',
        category: 'break',
      },
      {
        id: '4',
        startTime: '13:00',
        endTime: '14:30',
        title: 'Literatura',
        description: 'Leitura de clássicos brasileiros',
        category: 'study',
      },
      {
        id: '5',
        startTime: '14:45',
        endTime: '16:15',
        title: 'História',
        description: 'Revisão do período medieval',
        category: 'study',
      },
      {
        id: '6',
        startTime: '16:30',
        endTime: '17:30',
        title: 'Exercício Físico',
        description: 'Atividade física para relaxar a mente',
        category: 'break',
      },
      {
        id: '7',
        startTime: '18:00',
        endTime: '19:30',
        title: 'Revisão Geral',
        description: 'Revisão do conteúdo estudado no dia',
        category: 'study',
      }
    ];
    
    setScheduleItems(defaultItems);
    if (currentUser) {
      localStorage.setItem(`schedule-${currentUser.id}`, JSON.stringify(defaultItems));
    }
  };

  const addScheduleItem = (item: Omit<DailyScheduleItem, 'id'>) => {
    const newItem: DailyScheduleItem = {
      ...item,
      id: `schedule-${Date.now()}`,
    };
    setScheduleItems((prev) => [...prev, newItem]);
  };

  const updateScheduleItem = (id: string, updates: Partial<DailyScheduleItem>) => {
    setScheduleItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteScheduleItem = (id: string) => {
    setScheduleItems((prev) => prev.filter((item) => item.id !== id));
  };

  const value = {
    scheduleItems,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    loading,
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};
