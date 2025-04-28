
export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
  postponed: boolean;
  notes: string;
  priority?: "baixa" | "média" | "alta";
  duration?: number; // duração em minutos
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: string;
  studyGoals?: Record<string, number>; // minutos por dia por assunto
  notifications?: boolean;
}

export interface DailyScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  category: string;
  dayOfWeek?: number[]; // 0-6, domingo-sábado
  isRecurring?: boolean;
  color?: string;
}

export interface WeeklySchedule {
  [key: string]: DailyScheduleItem[]; // "0" para domingo, "1" para segunda, etc.
}

