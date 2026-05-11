import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { getTodayString } from '../utils/dates';
import { calculateLongestStreak } from '../utils/streaks';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';

export default function Dashboard() {
  const { habits, addHabit, toggleCompletion, deleteHabit } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = getTodayString();
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completions.includes(today)).length;
  const overallLongest = habits.reduce(
    (max, h) => Math.max(max, calculateLongestStreak(h.completions)),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white px-6 py-5 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Habit Tracker</h1>
        <p className="text-indigo-200 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{totalHabits}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total Habits</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-emerald-500">
              {completedToday}/{totalHabits}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Done Today</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{overallLongest}</div>
            <div className="text-xs text-gray-500 mt-0.5">Best Streak</div>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-lg font-medium text-gray-500">No habits yet</p>
            <p className="text-sm mt-1">Tap + to add your first habit</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleCompletion}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors"
        aria-label="Add new habit"
      >
        +
      </button>

      {isModalOpen && (
        <AddHabitModal
          onAdd={addHabit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
