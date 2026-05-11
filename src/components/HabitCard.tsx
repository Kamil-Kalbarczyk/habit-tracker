import { Habit } from '../types/habit';
import { getTodayString, formatDate, getLast7Days } from '../utils/dates';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streaks';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, dateStr: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const today = getTodayString();
  const isCompletedToday = habit.completions.includes(today);
  const currentStreak = calculateCurrentStreak(habit.completions);
  const longestStreak = calculateLongestStreak(habit.completions);
  const last7 = getLast7Days();
  const completionSet = new Set(habit.completions);

  return (
    <div
      className="bg-white rounded-xl shadow-sm border-l-4 p-4"
      style={{ borderLeftColor: habit.color }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: habit.color }}
        />
        <span className="font-semibold text-gray-800 flex-1 text-lg">{habit.name}</span>

        <button
          type="button"
          onClick={() => onToggle(habit.id, today)}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            isCompletedToday
              ? 'border-transparent text-white'
              : 'border-gray-300 text-transparent hover:border-gray-400'
          }`}
          style={isCompletedToday ? { backgroundColor: habit.color } : {}}
          title={isCompletedToday ? 'Mark incomplete' : 'Mark complete'}
          aria-label={isCompletedToday ? 'Mark incomplete' : 'Mark complete'}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onDelete(habit.id)}
          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-1"
          title="Delete habit"
          aria-label="Delete habit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm">
        <span className="text-gray-700 font-medium">
          {currentStreak > 0 ? `🔥 ${currentStreak} day${currentStreak !== 1 ? 's' : ''}` : '⬜ No streak'}
        </span>
        {longestStreak > 0 && (
          <span className="text-gray-400">Best: {longestStreak}d</span>
        )}
      </div>

      <div className="flex gap-1 mt-3">
        {last7.map(day => (
          <div
            key={day}
            className="w-5 h-5 rounded-sm"
            style={{ backgroundColor: completionSet.has(day) ? habit.color : '#e5e7eb' }}
            title={formatDate(day)}
          />
        ))}
      </div>
    </div>
  );
}
