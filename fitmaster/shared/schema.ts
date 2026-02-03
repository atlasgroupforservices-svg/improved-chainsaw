import { pgTable, text, serial, integer, boolean, timestamp, numeric, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  user_id: text("user_id"),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // Push, Pull, Legs, Skills, Cardio, Mobility
  exercise: text("exercise").notNull(),
  sets: integer("sets").notNull().default(0),
  reps: integer("reps").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
});

export const calories = pgTable("calories", {
  id: serial("id").primaryKey(),
  user_id: text("user_id"),
  date: timestamp("date").notNull(),
  caloriesIn: integer("calories_in").notNull().default(0),
  caloriesOut: integer("calories_out").notNull().default(0),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  user_id: text("user_id"),
  date: timestamp("date").notNull(),
  weight: numeric("weight").notNull(), // Stored as string in numeric
  pullupsMax: integer("pullups_max").default(0),
  dipsMax: integer("dips_max").default(0),
  handstandSeconds: integer("handstand_seconds").default(0),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  user_id: text("user_id"),
  metric: text("metric").notNull(), // weekly_hours, weight, pullups_max
  target: numeric("target").notNull(),
});

// === INSERT SCHEMAS ===

export const insertWorkoutSchema = createInsertSchema(workouts, {
  date: z.coerce.date(),
  exercise: z.string().min(1, "Exercise name is required"),
  sets: z.coerce.number().min(1, "Sets must be at least 1"),
  reps: z.coerce.number().min(1, "Reps must be at least 1"),
  minutes: z.coerce.number().min(1, "Minutes must be at least 1"),
}).omit({ id: true });

export const insertCalorieSchema = createInsertSchema(calories, {
  date: z.coerce.date(),
  caloriesIn: z.coerce.number().min(0, "Calories cannot be negative"),
  caloriesOut: z.coerce.number().min(0, "Calories cannot be negative"),
}).omit({ id: true });

export const insertProgressSchema = createInsertSchema(progress, {
  date: z.coerce.date(),
  weight: z.string(),
}).omit({ id: true });

export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });

// === TYPES ===

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type CalorieEntry = typeof calories.$inferSelect;
export type InsertCalorieEntry = z.infer<typeof insertCalorieSchema>;

export type ProgressEntry = typeof progress.$inferSelect;
export type InsertProgressEntry = z.infer<typeof insertProgressSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
