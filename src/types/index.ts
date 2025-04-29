
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
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string | null;
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
  [key: string]: DailyScheduleItem[]; // "domingo", "segunda", etc.
}
