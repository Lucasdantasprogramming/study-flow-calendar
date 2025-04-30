import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyScheduleItem, WeeklySchedule } from '../types';
import { useAuth } from './AuthContext';
import { scheduleService } from '@/lib/supabase';
import { toast } from 'sonner';
import { useMockData } from '@/lib/environment';

interface ScheduleContextType {
  scheduleItems: DailyScheduleItem[];
  weeklySchedule: WeeklySchedule;
  addScheduleItem: (item: Omit<DailyScheduleItem, 'id'>) => Promise<void>;
  updateScheduleItem: (id: string, updates: Partial<DailyScheduleItem>) => Promise<void>;
  deleteScheduleItem: (id: string) => Promise<void>;
  getScheduleForDay: (dayOfWeek: number) => DailyScheduleItem[];
  applyTemplateToDay: (template: DailyScheduleItem[], dayOfWeek: number) => Promise<void>;
  loading: boolean;
  error: string | null;
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
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Load schedule items when user changes
  useEffect(() => {
    const loadSchedule = async () => {
      if (!currentUser) {
        setScheduleItems([]);
        setWeeklySchedule({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        if (useMockData) {
          // Carregar dados simulados
          console.log('Using mock schedule data in development mode');
          const storedItems = localStorage.getItem(`schedule-${currentUser.id}`);
          if (storedItems) {
            setScheduleItems(JSON.parse(storedItems));
          } else {
            createDefaultSchedule();
          }
          
          const storedWeeklySchedule = localStorage.getItem(`weekly-schedule-${currentUser.id}`);
          if (storedWeeklySchedule) {
            setWeeklySchedule(JSON.parse(storedWeeklySchedule));
          } else {
            createDefaultWeeklySchedule();
          }
          
          // Importante: garantir que o loading seja finalizado mesmo com dados simulados
          setTimeout(() => setLoading(false), 500);
          return;
        }
        
        // Carregar dados do Supabase
        const userSchedule = await scheduleService.getWeeklySchedule(currentUser.id);
        setWeeklySchedule(userSchedule);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading schedule:', err);
        setError(err.message || 'Erro ao carregar cronograma');
        toast.error('Erro ao carregar cronograma');
        // Importante: garantir que o loading seja finalizado mesmo com erro
        setLoading(false);
      }
    };

    loadSchedule();
  }, [currentUser]);

  // Save schedule items to localStorage whenever they change
  useEffect(() => {
    if (currentUser && scheduleItems.length > 0 && useMockData) {
      localStorage.setItem(`schedule-${currentUser.id}`, JSON.stringify(scheduleItems));
    }
  }, [scheduleItems, currentUser]);

  // Salvar cronograma semanal no localStorage quando mudar
  useEffect(() => {
    if (currentUser && Object.keys(weeklySchedule).length > 0 && useMockData) {
      localStorage.setItem(`weekly-schedule-${currentUser.id}`, JSON.stringify(weeklySchedule));
    }
  }, [weeklySchedule, currentUser]);

  const createDefaultSchedule = () => {
    const defaultItems: DailyScheduleItem[] = [
      {
        id: '1',
        startTime: '08:00',
        endTime: '09:30',
        title: 'Matemática',
        description: 'Revisão de cálculo diferencial',
        category: 'study',
        isRecurring: true,
        dayOfWeek: [1, 3, 5], // Segunda, Quarta, Sexta
      },
      {
        id: '2',
        startTime: '09:45',
        endTime: '11:15',
        title: 'Física',
        description: 'Estudo de mecânica quântica',
        category: 'study',
        isRecurring: true,
        dayOfWeek: [1, 4], // Segunda, Quinta
      },
      {
        id: '3',
        startTime: '11:30',
        endTime: '12:30',
        title: 'Almoço',
        description: 'Pausa para refeição e descanso',
        category: 'break',
        isRecurring: true,
        dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Todos os dias
      },
      {
        id: '4',
        startTime: '13:00',
        endTime: '14:30',
        title: 'Literatura',
        description: 'Leitura de clássicos brasileiros',
        category: 'study',
        isRecurring: true,
        dayOfWeek: [2, 5], // Terça, Sexta
      },
      {
        id: '5',
        startTime: '14:45',
        endTime: '16:15',
        title: 'História',
        description: 'Revisão do período medieval',
        category: 'study',
        isRecurring: true,
        dayOfWeek: [3, 5], // Quarta, Sexta
      },
      {
        id: '6',
        startTime: '16:30',
        endTime: '17:30',
        title: 'Exercício Físico',
        description: 'Atividade física para relaxar a mente',
        category: 'break',
        isRecurring: true,
        dayOfWeek: [0, 2, 4, 6], // Domingo, Terça, Quinta, Sábado
      },
      {
        id: '7',
        startTime: '18:00',
        endTime: '19:30',
        title: 'Revisão Geral',
        description: 'Revisão do conteúdo estudado no dia',
        category: 'study',
        isRecurring: true,
        dayOfWeek: [1, 2, 3, 4, 5], // Segunda a Sexta
      }
    ];
    
    setScheduleItems(defaultItems);
    if (currentUser) {
      localStorage.setItem(`schedule-${currentUser.id}`, JSON.stringify(defaultItems));
    }
  };

  const createDefaultWeeklySchedule = () => {
    // Criar um cronograma semanal padrão
    const defaultWeeklySchedule: WeeklySchedule = {
      '1': [ // Segunda-feira
        {
          id: 'segunda-1',
          startTime: '08:00',
          endTime: '09:30',
          title: 'Matemática',
          description: 'Cálculo I',
          category: 'study',
        },
        {
          id: 'segunda-2',
          startTime: '10:00',
          endTime: '11:30',
          title: 'Física',
          description: 'Mecânica',
          category: 'study',
        }
      ],
      '3': [ // Quarta-feira
        {
          id: 'quarta-1',
          startTime: '08:00',
          endTime: '09:30',
          title: 'Química',
          description: 'Química Orgânica',
          category: 'study',
        },
        {
          id: 'quarta-2',
          startTime: '10:00',
          endTime: '11:30',
          title: 'Biologia',
          description: 'Genética',
          category: 'study',
        }
      ],
      '5': [ // Sexta-feira
        {
          id: 'sexta-1',
          startTime: '08:00',
          endTime: '10:00',
          title: 'Revisão Geral',
          description: 'Revisar todos os conteúdos da semana',
          category: 'study',
        },
        {
          id: 'sexta-2',
          startTime: '14:00',
          endTime: '15:30',
          title: 'Exercícios',
          description: 'Resolver exercícios de fixação',
          category: 'study',
        }
      ]
    };
    
    setWeeklySchedule(defaultWeeklySchedule);
    if (currentUser) {
      localStorage.setItem(`weekly-schedule-${currentUser.id}`, JSON.stringify(defaultWeeklySchedule));
    }
  };

  const getScheduleForDay = (dayOfWeek: number): DailyScheduleItem[] => {
    // Retorna os itens específicos para o dia da semana + itens recorrentes
    const dayItems = weeklySchedule[dayOfWeek.toString()] || [];
    
    // Adicione também os itens recorrentes que se aplicam a este dia da semana
    const recurringItems = scheduleItems.filter(item => 
      item.isRecurring && item.dayOfWeek?.includes(dayOfWeek)
    );
    
    // Combine e ordene por horário de início
    return [...dayItems, ...recurringItems].sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
  };

  const applyTemplateToDay = async (template: DailyScheduleItem[], dayOfWeek: number) => {
    try {
      // Criar novos IDs para os itens do template
      const itemsWithNewIds = template.map(item => ({
        ...item,
        id: `${dayOfWeek}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }));
      
      if (useMockData) {
        // Atualizar o cronograma semanal local
        setWeeklySchedule(prev => ({
          ...prev,
          [dayOfWeek.toString()]: itemsWithNewIds,
        }));
        return;
      }
      
      // Implementar para Supabase: primeiro excluir itens existentes para o dia
      // e depois adicionar os novos
      // Esta parte seria implementada quando tivermos um serviço de API para isso
      
      setWeeklySchedule(prev => ({
        ...prev,
        [dayOfWeek.toString()]: itemsWithNewIds,
      }));
    } catch (err: any) {
      console.error('Error applying template:', err);
      setError(err.message || 'Erro ao aplicar template');
      toast.error('Erro ao aplicar template');
    }
  };

  const addScheduleItem = async (item: Omit<DailyScheduleItem, 'id'>) => {
    try {
      if (useMockData) {
        const newItem: DailyScheduleItem = {
          ...item,
          id: `schedule-${Date.now()}`,
        };
        
        if (item.isRecurring && item.dayOfWeek && item.dayOfWeek.length > 0) {
          // Se for um item recorrente, adiciona à lista principal
          setScheduleItems((prev) => [...prev, newItem]);
        } else if (item.dayOfWeek && item.dayOfWeek.length === 1) {
          // Se for apenas para um dia específico da semana, adiciona ao cronograma semanal
          const dayOfWeek = item.dayOfWeek[0];
          setWeeklySchedule(prev => {
            const daySchedule = prev[dayOfWeek.toString()] || [];
            return {
              ...prev,
              [dayOfWeek.toString()]: [...daySchedule, newItem]
            };
          });
        } else {
          // Caso contrário, adiciona à lista principal
          setScheduleItems((prev) => [...prev, newItem]);
        }
        
        toast.success('Item adicionado ao cronograma');
        return;
      }
      
      // Adicionar ao Supabase
      if (!currentUser) return;
      
      const newItem = await scheduleService.addScheduleItem(currentUser.id, item);
      
      // Atualizar o estado local após adicionar no Supabase
      if (item.isRecurring && item.dayOfWeek && item.dayOfWeek.length > 0) {
        setScheduleItems(prev => [...prev, newItem]);
      } else if (item.dayOfWeek && item.dayOfWeek.length === 1) {
        const dayOfWeek = item.dayOfWeek[0];
        setWeeklySchedule(prev => {
          const daySchedule = prev[dayOfWeek.toString()] || [];
          return {
            ...prev,
            [dayOfWeek.toString()]: [...daySchedule, newItem]
          };
        });
      }
      
      toast.success('Item adicionado ao cronograma');
    } catch (err: any) {
      console.error('Error adding schedule item:', err);
      setError(err.message || 'Erro ao adicionar item');
      toast.error('Erro ao adicionar item ao cronograma');
    }
  };

  const updateScheduleItem = async (id: string, updates: Partial<DailyScheduleItem>) => {
    try {
      // Primeiro, tenta atualizar na lista principal
      const itemIndex = scheduleItems.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        // Item encontrado na lista principal
        if (useMockData) {
          setScheduleItems(prev => 
            prev.map(item => item.id === id ? { ...item, ...updates } : item)
          );
          toast.success('Item atualizado');
          return;
        }
        
        // Atualizar no Supabase
        await scheduleService.updateScheduleItem(id, updates);
        
        // Atualizar o estado local
        setScheduleItems(prev => 
          prev.map(item => item.id === id ? { ...item, ...updates } : item)
        );
        
        toast.success('Item atualizado');
        return;
      }
      
      // Procurar no cronograma semanal
      let found = false;
      
      if (useMockData) {
        setWeeklySchedule(prev => {
          const newSchedule = { ...prev };
          
          for (const [day, items] of Object.entries(newSchedule)) {
            const itemIndex = items.findIndex(item => item.id === id);
            
            if (itemIndex !== -1) {
              found = true;
              newSchedule[day] = items.map(item => 
                item.id === id ? { ...item, ...updates } : item
              );
              break;
            }
          }
          
          return found ? newSchedule : prev;
        });
        
        if (found) {
          toast.success('Item atualizado');
        }
        return;
      }
      
      // Atualizar no Supabase
      await scheduleService.updateScheduleItem(id, updates);
      
      // Atualizar o estado local
      setWeeklySchedule(prev => {
        const newSchedule = { ...prev };
        
        for (const [day, items] of Object.entries(newSchedule)) {
          const itemIndex = items.findIndex(item => item.id === id);
          
          if (itemIndex !== -1) {
            found = true;
            newSchedule[day] = items.map(item => 
              item.id === id ? { ...item, ...updates } : item
            );
            break;
          }
        }
        
        return found ? newSchedule : prev;
      });
      
      if (found) {
        toast.success('Item atualizado');
      }
    } catch (err: any) {
      console.error('Error updating schedule item:', err);
      setError(err.message || 'Erro ao atualizar item');
      toast.error('Erro ao atualizar item do cronograma');
    }
  };

  const deleteScheduleItem = async (id: string) => {
    try {
      // Primeiro, tenta excluir da lista principal
      const itemIndex = scheduleItems.findIndex(item => item.id === id);
      
      if (itemIndex !== -1) {
        // Item encontrado na lista principal
        if (useMockData) {
          setScheduleItems(prev => prev.filter(item => item.id !== id));
          toast.success('Item removido do cronograma');
          return;
        }
        
        // Excluir do Supabase
        await scheduleService.deleteScheduleItem(id);
        
        // Atualizar o estado local
        setScheduleItems(prev => prev.filter(item => item.id !== id));
        
        toast.success('Item removido do cronograma');
        return;
      }
      
      // Procurar no cronograma semanal
      if (useMockData) {
        setWeeklySchedule(prev => {
          const newSchedule = { ...prev };
          
          for (const [day, items] of Object.entries(newSchedule)) {
            const itemIndex = items.findIndex(item => item.id === id);
            
            if (itemIndex !== -1) {
              newSchedule[day] = items.filter(item => item.id !== id);
              break;
            }
          }
          
          return newSchedule;
        });
        
        toast.success('Item removido do cronograma');
        return;
      }
      
      // Excluir do Supabase
      await scheduleService.deleteScheduleItem(id);
      
      // Atualizar o estado local
      setWeeklySchedule(prev => {
        const newSchedule = { ...prev };
        
        for (const [day, items] of Object.entries(newSchedule)) {
          const itemIndex = items.findIndex(item => item.id === id);
          
          if (itemIndex !== -1) {
            newSchedule[day] = items.filter(item => item.id !== id);
            break;
          }
        }
        
        return newSchedule;
      });
      
      toast.success('Item removido do cronograma');
    } catch (err: any) {
      console.error('Error deleting schedule item:', err);
      setError(err.message || 'Erro ao excluir item');
      toast.error('Erro ao remover item do cronograma');
    }
  };

  const value = {
    scheduleItems,
    weeklySchedule,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    getScheduleForDay,
    applyTemplateToDay,
    loading,
    error
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};
