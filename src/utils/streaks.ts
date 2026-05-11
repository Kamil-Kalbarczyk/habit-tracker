import { getTodayString, getYesterdayString } from './dates';

function toLocalYMD(date: Date): string {
  return date.toLocaleDateString('en-CA');
}

export function calculateCurrentStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const set = new Set(completions);
  const today = getTodayString();
  const yesterday = getYesterdayString();

  let anchor: string;
  if (set.has(today)) {
    anchor = today;
  } else if (set.has(yesterday)) {
    anchor = yesterday;
  } else {
    return 0;
  }

  let count = 0;
  const cursor = new Date(anchor + 'T00:00:00');
  while (set.has(toLocalYMD(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function calculateLongestStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort();
  let max = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + 'T00:00:00');
    const curr = new Date(sorted[i] + 'T00:00:00');
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (diffDays === 1) {
      current++;
      max = Math.max(max, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }
  return max;
}
