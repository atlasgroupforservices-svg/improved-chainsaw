import { supabaseAdmin } from "@shared/supabase-server";
import {
  workouts, calories, progress, goals,
  type InsertWorkout, type Workout,
  type InsertCalorieEntry, type CalorieEntry,
  type InsertProgressEntry, type ProgressEntry,
  type InsertGoal, type Goal
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import type { PgTransaction } from "drizzle-orm/pg-core";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, "..", ".data", "storage.json");

export interface IStorage {
  // Workouts
  getWorkouts(userId: string): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout, userId: string): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>, userId: string): Promise<Workout>;
  deleteWorkout(id: number, userId: string): Promise<void>;

  // Calories
  getCalories(userId: string): Promise<CalorieEntry[]>;
  createCalorieEntry(entry: InsertCalorieEntry, userId: string): Promise<CalorieEntry>;
  updateCalorieEntry(id: number, entry: Partial<InsertCalorieEntry>, userId: string): Promise<CalorieEntry>;
  deleteCalorieEntry(id: number, userId: string): Promise<void>;

  // Progress
  getProgress(userId: string): Promise<ProgressEntry[]>;
  createProgressEntry(entry: InsertProgressEntry, userId: string): Promise<ProgressEntry>;
  updateProgressEntry(id: number, entry: Partial<InsertProgressEntry>, userId: string): Promise<ProgressEntry>;
  deleteProgressEntry(id: number, userId: string): Promise<void>;

  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal, userId: string): Promise<Goal>;
  updateGoal(id: number, goal: Partial<InsertGoal>, userId: string): Promise<Goal>;

  // Profile
  getProfile(userId: string): Promise<{ height: number; weight: number } | null>;
  saveProfile(userId: string, profile: { height: number; weight: number }): Promise<void>;

  // Backup
  importData(data: {
    workouts: any[];
    calories: any[];
    progress: any[];
    goals: any[];
  }, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Workouts
  async getWorkouts(userId: string): Promise<Workout[]> {
    return await db.select().from(workouts).where(eq(workouts.user_id, userId)).orderBy(desc(workouts.date));
  }
  async createWorkout(workout: InsertWorkout, userId: string): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values({ ...workout, user_id: userId }).returning();
    return newWorkout;
  }
  async updateWorkout(id: number, workout: Partial<InsertWorkout>, userId: string): Promise<Workout> {
    const [updated] = await db.update(workouts).set(workout).where(eq(workouts.id, id)).where(eq(workouts.user_id, userId)).returning();
    return updated;
  }
  async deleteWorkout(id: number, userId: string): Promise<void> {
    await db.delete(workouts).where(eq(workouts.id, id)).where(eq(workouts.user_id, userId));
  }

  // Calories
  async getCalories(userId: string): Promise<CalorieEntry[]> {
    return await db.select().from(calories).where(eq(calories.user_id, userId)).orderBy(desc(calories.date));
  }
  async createCalorieEntry(entry: InsertCalorieEntry, userId: string): Promise<CalorieEntry> {
    const [newEntry] = await db.insert(calories).values({ ...entry, user_id: userId }).returning();
    return newEntry;
  }
  async updateCalorieEntry(id: number, entry: Partial<InsertCalorieEntry>, userId: string): Promise<CalorieEntry> {
    const [updated] = await db.update(calories).set(entry).where(eq(calories.id, id)).where(eq(calories.user_id, userId)).returning();
    return updated;
  }
  async deleteCalorieEntry(id: number, userId: string): Promise<void> {
    await db.delete(calories).where(eq(calories.id, id)).where(eq(calories.user_id, userId));
  }

  // Progress
  async getProgress(userId: string): Promise<ProgressEntry[]> {
    return await db.select().from(progress).where(eq(progress.user_id, userId)).orderBy(desc(progress.date));
  }
  async createProgressEntry(entry: InsertProgressEntry, userId: string): Promise<ProgressEntry> {
    const [newEntry] = await db.insert(progress).values({ ...entry, user_id: userId }).returning();
    return newEntry;
  }
  async updateProgressEntry(id: number, entry: Partial<InsertProgressEntry>, userId: string): Promise<ProgressEntry> {
    const [updated] = await db.update(progress).set(entry).where(eq(progress.id, id)).where(eq(progress.user_id, userId)).returning();
    return updated;
  }
  async deleteProgressEntry(id: number, userId: string): Promise<void> {
    await db.delete(progress).where(eq(progress.id, id)).where(eq(progress.user_id, userId));
  }

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.user_id, userId));
  }
  async createGoal(goal: InsertGoal, userId: string): Promise<Goal> {
    const [newGoal] = await db.insert(goals).values({ ...goal, user_id: userId }).returning();
    return newGoal;
  }
  async updateGoal(id: number, goal: Partial<InsertGoal>, userId: string): Promise<Goal> {
    const [updated] = await db.update(goals).set(goal).where(eq(goals.id, id)).where(eq(goals.user_id, userId)).returning();
    return updated;
  }

  // Profile
  async getProfile(userId: string): Promise<{ height: number; weight: number } | null> {
    // For now, just return null - profiles would need a separate table in a real DB
    return null;
  }

  async saveProfile(userId: string, profile: { height: number; weight: number }): Promise<void> {
    // For now, this is a no-op - profiles would need a separate table in a real DB
  }

  // Backup
  async importData(data: {
    workouts: any[];
    calories: any[];
    progress: any[];
    goals: any[];
  }, userId: string): Promise<void> {
    if (!db) {
      throw new Error("Database not available for import");
    }
    await (db as any).transaction(async (tx: any) => {
      // Clear existing data for user
      await tx.delete(workouts).where(eq(workouts.user_id, userId));
      await tx.delete(calories).where(eq(calories.user_id, userId));
      await tx.delete(progress).where(eq(progress.user_id, userId));
      await tx.delete(goals).where(eq(goals.user_id, userId));

      if (data.workouts.length) await tx.insert(workouts).values(data.workouts.map((w: any) => ({ ...w, user_id: userId })));
      if (data.calories.length) await tx.insert(calories).values(data.calories.map((c: any) => ({ ...c, user_id: userId })));
      if (data.progress.length) await tx.insert(progress).values(data.progress.map((p: any) => ({ ...p, user_id: userId })));
      if (data.goals.length) await tx.insert(goals).values(data.goals.map((g: any) => ({ ...g, user_id: userId })));
    });
  }
}

// Memory storage implementation for development when database is not available
export class MemoryStorage implements IStorage {
  private workoutsData: Map<string, (Workout & { id: number })[]> = new Map();
  private caloriesData: Map<string, (CalorieEntry & { id: number })[]> = new Map();
  private progressData: Map<string, (ProgressEntry & { id: number })[]> = new Map();
  private goalsData: Map<string, (Goal & { id: number })[]> = new Map();
  private profilesData: Map<string, { height: number; weight: number }> = new Map();
  private workoutCounter = 1;
  private calorieCounter = 1;
  private progressCounter = 1;
  private goalCounter = 1;

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(dataFile)) {
        const stored = fs.readFileSync(dataFile, "utf-8");
        const data = JSON.parse(stored);
        this.workoutsData = new Map(data.workouts);
        this.caloriesData = new Map(data.calories);
        this.progressData = new Map(data.progress);
        this.goalsData = new Map(data.goals);
        this.profilesData = new Map(data.profiles || []);
        this.workoutCounter = data.workoutCounter || 1;
        this.calorieCounter = data.calorieCounter || 1;
        this.progressCounter = data.progressCounter || 1;
        this.goalCounter = data.goalCounter || 1;
        console.log("✓ Data loaded from server storage");
      }
    } catch (error) {
      console.error("Failed to load from server storage:", error);
    }
  }

  private saveToFile() {
    try {
      const dataDir = path.dirname(dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        workouts: Array.from(this.workoutsData.entries()),
        calories: Array.from(this.caloriesData.entries()),
        progress: Array.from(this.progressData.entries()),
        goals: Array.from(this.goalsData.entries()),
        profiles: Array.from(this.profilesData.entries()),
        workoutCounter: this.workoutCounter,
        calorieCounter: this.calorieCounter,
        progressCounter: this.progressCounter,
        goalCounter: this.goalCounter,
      };
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Failed to save to server storage:", error);
    }
  }

  // Workouts
  async getWorkouts(userId: string): Promise<Workout[]> {
    return (this.workoutsData.get(userId) || []).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createWorkout(workout: InsertWorkout, userId: string): Promise<Workout> {
    const newWorkout = { ...workout, id: this.workoutCounter++, user_id: userId } as Workout;
    const userWorkouts = this.workoutsData.get(userId) || [];
    userWorkouts.push(newWorkout);
    this.workoutsData.set(userId, userWorkouts);
    this.saveToFile();
    return newWorkout;
  }

  async updateWorkout(id: number, workout: Partial<InsertWorkout>, userId: string): Promise<Workout> {
    const userWorkouts = this.workoutsData.get(userId) || [];
    const index = userWorkouts.findIndex(w => w.id === id);
    if (index === -1) throw new Error("Workout not found");
    const updated = { ...userWorkouts[index], ...workout };
    userWorkouts[index] = updated;
    this.workoutsData.set(userId, userWorkouts);
    this.saveToFile();
    return updated;
  }

  async deleteWorkout(id: number, userId: string): Promise<void> {
    const userWorkouts = this.workoutsData.get(userId) || [];
    const filtered = userWorkouts.filter(w => w.id !== id);
    this.workoutsData.set(userId, filtered);
    this.saveToFile();
  }

  // Calories
  async getCalories(userId: string): Promise<CalorieEntry[]> {
    return (this.caloriesData.get(userId) || []).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createCalorieEntry(entry: InsertCalorieEntry, userId: string): Promise<CalorieEntry> {
    const newEntry = { ...entry, id: this.calorieCounter++, user_id: userId } as CalorieEntry;
    const userCalories = this.caloriesData.get(userId) || [];
    userCalories.push(newEntry);
    this.caloriesData.set(userId, userCalories);
    this.saveToFile();
    return newEntry;
  }

  async updateCalorieEntry(id: number, entry: Partial<InsertCalorieEntry>, userId: string): Promise<CalorieEntry> {
    const userCalories = this.caloriesData.get(userId) || [];
    const index = userCalories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Calorie entry not found");
    const updated = { ...userCalories[index], ...entry };
    userCalories[index] = updated;
    this.caloriesData.set(userId, userCalories);
    this.saveToFile();
    return updated;
  }

  async deleteCalorieEntry(id: number, userId: string): Promise<void> {
    const userCalories = this.caloriesData.get(userId) || [];
    const filtered = userCalories.filter(c => c.id !== id);
    this.caloriesData.set(userId, filtered);
    this.saveToFile();
  }

  // Progress
  async getProgress(userId: string): Promise<ProgressEntry[]> {
    return (this.progressData.get(userId) || []).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createProgressEntry(entry: InsertProgressEntry, userId: string): Promise<ProgressEntry> {
    const newEntry = { ...entry, id: this.progressCounter++, user_id: userId } as ProgressEntry;
    const userProgress = this.progressData.get(userId) || [];
    userProgress.push(newEntry);
    this.progressData.set(userId, userProgress);
    this.saveToFile();
    return newEntry;
  }

  async updateProgressEntry(id: number, entry: Partial<InsertProgressEntry>, userId: string): Promise<ProgressEntry> {
    const userProgress = this.progressData.get(userId) || [];
    const index = userProgress.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Progress entry not found");
    const updated = { ...userProgress[index], ...entry };
    userProgress[index] = updated;
    this.progressData.set(userId, userProgress);
    this.saveToFile();
    return updated;
  }

  async deleteProgressEntry(id: number, userId: string): Promise<void> {
    const userProgress = this.progressData.get(userId) || [];
    const filtered = userProgress.filter(p => p.id !== id);
    this.progressData.set(userId, filtered);
    this.saveToFile();
  }

  // Goals
  async getGoals(userId: string): Promise<Goal[]> {
    return this.goalsData.get(userId) || [];
  }

  async createGoal(goal: InsertGoal, userId: string): Promise<Goal> {
    const newGoal = { ...goal, id: this.goalCounter++, user_id: userId } as Goal;
    const userGoals = this.goalsData.get(userId) || [];
    userGoals.push(newGoal);
    this.goalsData.set(userId, userGoals);
    this.saveToFile();
    return newGoal;
  }

  async updateGoal(id: number, goal: Partial<InsertGoal>, userId: string): Promise<Goal> {
    const userGoals = this.goalsData.get(userId) || [];
    const index = userGoals.findIndex(g => g.id === id);
    if (index === -1) throw new Error("Goal not found");
    const updated = { ...userGoals[index], ...goal };
    userGoals[index] = updated;
    this.goalsData.set(userId, userGoals);
    this.saveToFile();
    return updated;
  }

  // Profile
  async getProfile(userId: string): Promise<{ height: number; weight: number } | null> {
    const profiles = this.profilesData || new Map();
    return profiles.get(userId) || null;
  }

  async saveProfile(userId: string, profile: { height: number; weight: number }): Promise<void> {
    if (!this.profilesData) {
      this.profilesData = new Map();
    }
    this.profilesData.set(userId, profile);
    this.saveToFile();
  }

  // Backup
  async importData(data: {
    workouts: any[];
    calories: any[];
    progress: any[];
    goals: any[];
  }, userId: string): Promise<void> {
    this.workoutsData.set(userId, data.workouts.map((w, i) => ({ ...w, user_id: userId, id: this.workoutCounter + i })));
    this.caloriesData.set(userId, data.calories.map((c, i) => ({ ...c, user_id: userId, id: this.calorieCounter + i })));
    this.progressData.set(userId, data.progress.map((p, i) => ({ ...p, user_id: userId, id: this.progressCounter + i })));
    this.goalsData.set(userId, data.goals.map((g, i) => ({ ...g, user_id: userId, id: this.goalCounter + i })));
    this.workoutCounter += data.workouts.length;
    this.calorieCounter += data.calories.length;
    this.progressCounter += data.progress.length;
    this.goalCounter += data.goals.length;
    this.saveToFile();
  }
}

export const storage = db ? new DatabaseStorage() : new MemoryStorage();
