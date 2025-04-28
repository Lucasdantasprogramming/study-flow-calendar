
export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
  postponed: boolean;
  notes: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface DailyScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  category: string;
}
