
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
    priority: 'alta',
    completed: false,
    postponed: false,
    category: 'programming',
    duration: 120,
    notes: 'Focar em useEffect e useState'
  },
  {
    id: '2',
    title: 'Revisar matemática',
    description: 'Capítulo 5 - Cálculo diferencial',
    date: new Date(Date.now() + 86400000), // Tomorrow
    priority: 'média',
    completed: false,
    postponed: false,
    category: 'mathematics',
    duration: 90,
    notes: ''
  },
  {
    id: '3',
    title: 'Ler artigo científico',
    description: 'Machine Learning aplicado à medicina',
    date: new Date(),
    priority: 'baixa',
    completed: true,
    postponed: false,
    category: 'science',
    duration: 45,
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
      dayOfWeek: [1, 3, 5],
      color: '#4CAF50',
      description: 'Foco em React e TypeScript',
      category: 'estudo'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: [1, 2, 3, 4, 5],
      color: '#FFC107',
      description: '',
      category: 'refeição'
    }
  ],
  terça: [
    {
      id: '3',
      title: 'Estudar Matemática',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: [2, 4],
      color: '#2196F3',
      description: 'Revisão de cálculo',
      category: 'estudo'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: [1, 2, 3, 4, 5],
      color: '#FFC107',
      description: '',
      category: 'refeição'
    }
  ],
  quarta: [
    {
      id: '1',
      title: 'Estudar Programação',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: [1, 3, 5],
      color: '#4CAF50',
      description: 'Foco em React e TypeScript',
      category: 'estudo'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: [1, 2, 3, 4, 5],
      color: '#FFC107',
      description: '',
      category: 'refeição'
    }
  ],
  quinta: [
    {
      id: '3',
      title: 'Estudar Matemática',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: [2, 4],
      color: '#2196F3',
      description: 'Revisão de cálculo',
      category: 'estudo'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: [1, 2, 3, 4, 5],
      color: '#FFC107',
      description: '',
      category: 'refeição'
    }
  ],
  sexta: [
    {
      id: '1',
      title: 'Estudar Programação',
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: [1, 3, 5],
      color: '#4CAF50',
      description: 'Foco em React e TypeScript',
      category: 'estudo'
    },
    {
      id: '2',
      title: 'Almoço',
      startTime: '12:00',
      endTime: '13:00',
      dayOfWeek: [1, 2, 3, 4, 5],
      color: '#FFC107',
      description: '',
      category: 'refeição'
    },
    {
      id: '4',
      title: 'Revisão da semana',
      startTime: '16:00',
      endTime: '18:00',
      dayOfWeek: [5],
      color: '#9C27B0',
      description: 'Consolidar o aprendizado da semana',
      category: 'estudo'
    }
  ],
  sábado: [
    {
      id: '5',
      title: 'Estudo livre',
      startTime: '10:00',
      endTime: '12:00',
      dayOfWeek: [6],
      color: '#FF5722',
      description: 'Escolher um tópico de interesse',
      category: 'lazer'
    }
  ],
  domingo: []
};
