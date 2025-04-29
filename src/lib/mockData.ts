
import { User, Task, DailyScheduleItem, WeeklySchedule } from '@/types';

// Mock user data
export const mockCurrentUser: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  name: 'Demo User',
  photoURL: null,
  preferences: {
    theme: 'light',
    notifications: true,
  }
};

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Estudar React',
    description: 'Revisar hooks e componentes funcionais',
    date: new Date(),
    priority: 'high',
    completed: false,
    category: 'programming',
    timeEstimate: 120,
    notes: 'Focar em useEffect e useState'
  },
  {
    id: '2',
    title: 'Revisar matemática',
    description: 'Capítulo 5 - Cálculo diferencial',
    date: new Date(Date.now() + 86400000), // Tomorrow
    priority: 'medium',
    completed: false,
    category: 'mathematics',
    timeEstimate: 90,
    notes: ''
  },
  {
    id: '3',
    title: 'Ler artigo científico',
    description: 'Machine Learning aplicado à medicina',
    date: new Date(),
    priority: 'low',
    completed: true,
    category: 'science',
    timeEstimate: 45,
    notes: 'Anotar pontos principais'
  }
];

// Mock schedule
export const mockSchedule: WeeklySchedule = {
  segunda: [
    {
      id: '1',
      title: 'Estudar Programação',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: ['segunda', 'quarta', 'sexta'],
      color: '#4CAF50',
      description: 'Foco em React e TypeScript'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
      color: '#FFC107',
      description: ''
    }
  ],
  terça: [
    {
      id: '3',
      title: 'Estudar Matemática',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: ['terça', 'quinta'],
      color: '#2196F3',
      description: 'Revisão de cálculo'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
      color: '#FFC107',
      description: ''
    }
  ],
  quarta: [
    {
      id: '1',
      title: 'Estudar Programação',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: ['segunda', 'quarta', 'sexta'],
      color: '#4CAF50',
      description: 'Foco em React e TypeScript'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
      color: '#FFC107',
      description: ''
    }
  ],
  quinta: [
    {
      id: '3',
      title: 'Estudar Matemática',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: ['terça', 'quinta'],
      color: '#2196F3',
      description: 'Revisão de cálculo'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
      color: '#FFC107',
      description: ''
    }
  ],
  sexta: [
    {
      id: '1',
      title: 'Estudar Programação',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: ['segunda', 'quarta', 'sexta'],
      color: '#4CAF50',
      description: 'Foco em React e TypeScript'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
      color: '#FFC107',
      description: ''
    },
    {
      id: '4',
      title: 'Revisão da semana',
      startTime: '16:00',
      endTime: '18:00',
      dayOfWeek: ['sexta'],
      color: '#9C27B0',
      description: 'Consolidar o aprendizado da semana'
    }
  ],
  sábado: [
    {
      id: '5',
      title: 'Estudo livre',
      startTime: '10:00',
      endTime: '12:00',
      dayOfWeek: ['sábado'],
      color: '#FF5722',
      description: 'Escolher um tópico de interesse'
    }
  ],
  domingo: []
};
