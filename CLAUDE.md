# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git workflow

After every meaningful change (feature, fix, refactor), commit and push to GitHub:

```bash
git add <changed files>
git commit -m "short description of what changed and why"
git push
```

Commit at logical checkpoints — not after every line, but never leave a working session without pushing. This ensures the user can always roll back to a known-good state.

## Commands

```bash
npm run dev       # start Vite dev server (hot reload)
npm run build     # type-check then bundle for production
npm run lint      # ESLint across all files
npm run preview   # serve the production build locally
```

There is no test suite configured.

## Architecture

The app is a single-page React + TypeScript habit tracker. All state lives in one custom hook; there is no router, no backend, and no external state library.

**Data flow:**
- `useHabits` (`src/hooks/useHabits.ts`) is the single source of truth. It reads/writes `localStorage` under the key `habit-tracker-habits` and exposes `{ habits, addHabit, toggleCompletion, deleteHabit }`.
- `Dashboard` consumes `useHabits`, computes summary stats (total habits, completed today, best streak across all habits), and renders the layout.
- `HabitCard` is a pure display component that receives a single `Habit` and the two event callbacks (`onToggle`, `onDelete`). It computes its own streak values locally by calling the util functions directly.
- `AddHabitModal` is a controlled form component — it calls `onAdd(name, color)` and `onClose()` props; no internal state escapes it.

**Data model (`src/types/habit.ts`):**
```ts
interface Habit {
  id: string;         // uuid v4
  name: string;
  color: string;      // hex color chosen by user
  createdAt: string;  // YYYY-MM-DD
  completions: string[]; // array of YYYY-MM-DD strings
}
```

**Date handling (`src/utils/dates.ts`):**
All dates are stored and compared as local `YYYY-MM-DD` strings produced by `toLocaleDateString('en-CA')`. Never use `toISOString()` for date keys — it returns UTC and will produce wrong dates for users west of UTC.

**Streak logic (`src/utils/streaks.ts`):**
- `calculateCurrentStreak` anchors on today or yesterday (a missed day resets to 0).
- `calculateLongestStreak` sorts the completions array and counts the longest consecutive run.
- Both functions accept only the `completions` string array, so they are easy to unit-test in isolation.

## Styling

Tailwind CSS v3 with no custom theme extensions. Habit colors are applied via inline `style` props (not Tailwind utility classes) because they are dynamic user-chosen hex values — Tailwind cannot purge dynamic class names safely.
