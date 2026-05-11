export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  completions: string[];
}

export interface HabitStore {
  habits: Habit[];
  addHabit: (name: string, color: string) => void;
  toggleCompletion: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;
}
