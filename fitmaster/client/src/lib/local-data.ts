import type {
  Workout,
  InsertWorkout,
  CalorieEntry,
  InsertCalorieEntry,
  ProgressEntry,
  InsertProgressEntry,
  Goal,
  InsertGoal,
} from "@shared/schema";

const STORAGE_KEYS = {
  workouts: "fitmaster.workouts",
  calories: "fitmaster.calories",
  progress: "fitmaster.progress",
  goals: "fitmaster.goals",
  profile: "fitmaster.profile",
};

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

const readJson = <T>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T>(key: string, value: T) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getNextId = (items: Array<{ id: number }>) => {
  const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
};

const sortByDateDesc = <T extends { date: string }>(items: T[]) =>
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getLocalWorkouts = (): Workout[] =>
  sortByDateDesc(readJson<Workout[]>(STORAGE_KEYS.workouts, []));

export const createLocalWorkout = (data: InsertWorkout): Workout => {
  const items = getLocalWorkouts();
  const entry: Workout = {
    id: getNextId(items),
    user_id: null,
    date: new Date(data.date).toISOString(),
    type: data.type,
    exercise: data.exercise,
    sets: Number(data.sets),
    reps: Number(data.reps),
    minutes: Number(data.minutes),
  };
  items.unshift(entry);
  writeJson(STORAGE_KEYS.workouts, items);
  return entry;
};

export const updateLocalWorkout = (id: number, data: Partial<InsertWorkout>): Workout | null => {
  const items = getLocalWorkouts();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const existing = items[index];
  const updated: Workout = {
    ...existing,
    ...data,
    date: data.date ? new Date(data.date).toISOString() : existing.date,
    sets: data.sets !== undefined ? Number(data.sets) : existing.sets,
    reps: data.reps !== undefined ? Number(data.reps) : existing.reps,
    minutes: data.minutes !== undefined ? Number(data.minutes) : existing.minutes,
  };
  items[index] = updated;
  writeJson(STORAGE_KEYS.workouts, sortByDateDesc(items));
  return updated;
};

export const deleteLocalWorkout = (id: number) => {
  const items = getLocalWorkouts().filter((item) => item.id !== id);
  writeJson(STORAGE_KEYS.workouts, items);
};

export const getLocalCalories = (): CalorieEntry[] =>
  sortByDateDesc(readJson<CalorieEntry[]>(STORAGE_KEYS.calories, []));

export const createLocalCalorie = (data: InsertCalorieEntry): CalorieEntry => {
  const items = getLocalCalories();
  const entry: CalorieEntry = {
    id: getNextId(items),
    user_id: null,
    date: new Date(data.date).toISOString(),
    caloriesIn: Number(data.caloriesIn),
    caloriesOut: Number(data.caloriesOut),
  };
  items.unshift(entry);
  writeJson(STORAGE_KEYS.calories, items);
  return entry;
};

export const updateLocalCalorie = (
  id: number,
  data: Partial<InsertCalorieEntry>,
): CalorieEntry | null => {
  const items = getLocalCalories();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const existing = items[index];
  const updated: CalorieEntry = {
    ...existing,
    ...data,
    date: data.date ? new Date(data.date).toISOString() : existing.date,
    caloriesIn: data.caloriesIn !== undefined ? Number(data.caloriesIn) : existing.caloriesIn,
    caloriesOut: data.caloriesOut !== undefined ? Number(data.caloriesOut) : existing.caloriesOut,
  };
  items[index] = updated;
  writeJson(STORAGE_KEYS.calories, sortByDateDesc(items));
  return updated;
};

export const deleteLocalCalorie = (id: number) => {
  const items = getLocalCalories().filter((item) => item.id !== id);
  writeJson(STORAGE_KEYS.calories, items);
};

export const getLocalProgress = (): ProgressEntry[] =>
  sortByDateDesc(readJson<ProgressEntry[]>(STORAGE_KEYS.progress, []));

export const createLocalProgress = (data: InsertProgressEntry): ProgressEntry => {
  const items = getLocalProgress();
  const entry: ProgressEntry = {
    id: getNextId(items),
    user_id: null,
    date: new Date(data.date).toISOString(),
    weight: String(data.weight),
    pullupsMax: Number(data.pullupsMax ?? 0),
    dipsMax: Number(data.dipsMax ?? 0),
    handstandSeconds: Number(data.handstandSeconds ?? 0),
  };
  items.unshift(entry);
  writeJson(STORAGE_KEYS.progress, items);
  return entry;
};

export const updateLocalProgress = (
  id: number,
  data: Partial<InsertProgressEntry>,
): ProgressEntry | null => {
  const items = getLocalProgress();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const existing = items[index];
  const updated: ProgressEntry = {
    ...existing,
    ...data,
    date: data.date ? new Date(data.date).toISOString() : existing.date,
    weight: data.weight !== undefined ? String(data.weight) : existing.weight,
    pullupsMax: data.pullupsMax !== undefined ? Number(data.pullupsMax) : existing.pullupsMax,
    dipsMax: data.dipsMax !== undefined ? Number(data.dipsMax) : existing.dipsMax,
    handstandSeconds:
      data.handstandSeconds !== undefined
        ? Number(data.handstandSeconds)
        : existing.handstandSeconds,
  };
  items[index] = updated;
  writeJson(STORAGE_KEYS.progress, sortByDateDesc(items));
  return updated;
};

export const deleteLocalProgress = (id: number) => {
  const items = getLocalProgress().filter((item) => item.id !== id);
  writeJson(STORAGE_KEYS.progress, items);
};

export const getLocalGoals = (): Goal[] => readJson<Goal[]>(STORAGE_KEYS.goals, []);

export const createLocalGoal = (data: InsertGoal): Goal => {
  const items = getLocalGoals();
  const entry: Goal = {
    id: getNextId(items),
    user_id: null,
    metric: data.metric,
    target: data.target,
  };
  items.unshift(entry);
  writeJson(STORAGE_KEYS.goals, items);
  return entry;
};

export const getLocalProfile = () =>
  readJson<{ height: number; weight: number }>(STORAGE_KEYS.profile, {
    height: 180,
    weight: 75,
  });

export const saveLocalProfile = (profile: { height: number; weight: number }) => {
  writeJson(STORAGE_KEYS.profile, profile);
};
