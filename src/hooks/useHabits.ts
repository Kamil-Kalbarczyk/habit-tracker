import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitStore } from '../types/habit';
import { getTodayString } from '../utils/dates';

const STORAGE_KEY = 'habit-tracker-habits';

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    return [];
  }
}

export function useHabits(): HabitStore {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  function addHabit(name: string, color: string): void {
    if (!name.trim()) return;
    const newHabit: Habit = {
      id: uuidv4(),
      name: name.trim(),
      color,
      createdAt: getTodayString(),
      completions: [],
    };
    setHabits(prev => [...prev, newHabit]);
  }

  function toggleCompletion(id: string, dateStr: string): void {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;
        const has = habit.completions.includes(dateStr);
        return {
          ...habit,
          completions: has
            ? habit.completions.filter(d => d !== dateStr)
            : [...habit.completions, dateStr],
        };
      })
    );
  }

  function deleteHabit(id: string): void {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  return { habits, addHabit, toggleCompletion, deleteHabit };
}
