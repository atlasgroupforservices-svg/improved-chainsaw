import type { Express } from "express";
import type { Server } from "http";
import { supabaseAdmin } from "@shared/supabase-server";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === WORKOUTS ===
  app.get(api.workouts.list.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('workouts')
        .select('*')
        .eq('user_id', req.user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      res.json(data);
    } else {
      const data = await storage.getWorkouts(req.user.id);
      res.json(data);
    }
  });

  app.post(api.workouts.create.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.workouts.create.input.parse(req.body);
      if (input.minutes <= 0) return res.status(400).json({ message: "Minutes must be positive" });
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('workouts')
          .insert({ ...input, user_id: req.user.id })
          .select()
          .single();
        if (error) throw error;
        res.status(201).json(data);
      } else {
        const data = await storage.createWorkout(input, req.user.id);
        res.status(201).json(data);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.workouts.update.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.workouts.update.input.parse(req.body);
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('workouts')
          .update(input)
          .eq('id', Number(req.params.id))
          .eq('user_id', req.user.id)
          .select()
          .single();
        if (error) throw error;
        res.json(data);
      } else {
        const data = await storage.updateWorkout(Number(req.params.id), input, req.user.id);
        res.json(data);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.workouts.delete.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('workouts')
        .delete()
        .eq('id', Number(req.params.id))
        .eq('user_id', req.user.id);
      if (error) throw error;
      res.status(204).send();
    } else {
      await storage.deleteWorkout(Number(req.params.id), req.user.id);
      res.status(204).send();
    }
  });

  // === CALORIES ===
  app.get(api.calories.list.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('calories')
        .select('*')
        .eq('user_id', req.user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      res.json(data);
    } else {
      const data = await storage.getCalories(req.user.id);
      res.json(data);
    }
  });

  app.post(api.calories.create.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.calories.create.input.parse(req.body);
      if (input.caloriesIn < 0 || input.caloriesOut < 0) {
        return res.status(400).json({ message: "Calories cannot be negative" });
      }
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('calories')
          .insert({ ...input, user_id: req.user.id })
          .select()
          .single();
        if (error) throw error;
        res.status(201).json(data);
      } else {
        const data = await storage.createCalorieEntry(input, req.user.id);
        res.status(201).json(data);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.calories.update.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.calories.update.input.parse(req.body);
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('calories')
          .update(input)
          .eq('id', Number(req.params.id))
          .eq('user_id', req.user.id)
          .select()
          .single();
        if (error) throw error;
        res.json(data);
      } else {
        const data = await storage.updateCalorieEntry(Number(req.params.id), input, req.user.id);
        res.json(data);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.calories.delete.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('calories')
        .delete()
        .eq('id', Number(req.params.id))
        .eq('user_id', req.user.id);
      if (error) throw error;
      res.status(204).send();
    } else {
      await storage.deleteCalorieEntry(Number(req.params.id), req.user.id);
      res.status(204).send();
    }
  });

  // === PROGRESS ===
  app.get(api.progress.list.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('progress')
        .select('*')
        .eq('user_id', req.user.id)
        .order('date', { ascending: false });
      if (error) throw error;
      res.json(data);
    } else {
      const data = await storage.getProgress(req.user.id);
      res.json(data);
    }
  });

  app.post(api.progress.create.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.progress.create.input.parse(req.body);
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('progress')
          .insert({ ...input, user_id: req.user.id })
          .select()
          .single();
        if (error) throw error;
        res.status(201).json(data);
      } else {
        const data = await storage.createProgressEntry(input, req.user.id);
        res.status(201).json(data);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.progress.update.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.progress.update.input.parse(req.body);
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('progress')
          .update(input)
          .eq('id', Number(req.params.id))
          .eq('user_id', req.user.id)
          .select()
          .single();
        if (error) throw error;
        res.json(data);
      } else {
        const data = await storage.updateProgressEntry(Number(req.params.id), input, req.user.id);
        res.json(data);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.progress.delete.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('progress')
        .delete()
        .eq('id', Number(req.params.id))
        .eq('user_id', req.user.id);
      if (error) throw error;
      res.status(204).send();
    } else {
      await storage.deleteProgressEntry(Number(req.params.id), req.user.id);
      res.status(204).send();
    }
  });

  // === GOALS ===
  app.get(api.goals.list.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('goals')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data);
    } else {
      const data = await storage.getGoals(req.user.id);
      res.json(data);
    }
  });

  app.post(api.goals.create.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.goals.create.input.parse(req.body);
      if (supabaseAdmin) {
        const { data, error } = await supabaseAdmin
          .from('goals')
          .insert({ ...input, user_id: req.user.id })
          .select()
          .single();
        if (error) throw error;
        res.status(201).json(data);
      } else {
        const data = await storage.createGoal(input, req.user.id);
        res.status(201).json(data);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === BACKUP ===
  app.get(api.backup.export.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    if (supabaseAdmin) {
      const [workoutsRes, caloriesRes, progressRes, goalsRes] = await Promise.all([
        supabaseAdmin.from('workouts').select('*').eq('user_id', req.user.id),
        supabaseAdmin.from('calories').select('*').eq('user_id', req.user.id),
        supabaseAdmin.from('progress').select('*').eq('user_id', req.user.id),
        supabaseAdmin.from('goals').select('*').eq('user_id', req.user.id)
      ]);
      if (workoutsRes.error || caloriesRes.error || progressRes.error || goalsRes.error) {
        throw workoutsRes.error || caloriesRes.error || progressRes.error || goalsRes.error;
      }
      res.json({
        workouts: workoutsRes.data,
        calories: caloriesRes.data,
        progress: progressRes.data,
        goals: goalsRes.data
      });
    } else {
      const [workouts, calories, progress, goals] = await Promise.all([
        storage.getWorkouts(req.user.id),
        storage.getCalories(req.user.id),
        storage.getProgress(req.user.id),
        storage.getGoals(req.user.id)
      ]);
      res.json({
        workouts,
        calories,
        progress,
        goals
      });
    }
  });

  app.post(api.backup.import.path, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const input = api.backup.import.input.parse(req.body);
      // Delete existing data for the user
      await Promise.all([
        supabaseAdmin.from('workouts').delete().eq('user_id', req.user.id),
        supabaseAdmin.from('calories').delete().eq('user_id', req.user.id),
        supabaseAdmin.from('progress').delete().eq('user_id', req.user.id),
        supabaseAdmin.from('goals').delete().eq('user_id', req.user.id)
      ]);
      // Insert new data
      const inserts = [];
      if (input.workouts) {
        inserts.push(supabaseAdmin.from('workouts').insert(input.workouts.map(w => ({ ...w, user_id: req.user.id }))));
      }
      if (input.calories) {
        inserts.push(supabaseAdmin.from('calories').insert(input.calories.map(c => ({ ...c, user_id: req.user.id }))));
      }
      if (input.progress) {
        inserts.push(supabaseAdmin.from('progress').insert(input.progress.map(p => ({ ...p, user_id: req.user.id }))));
      }
      if (input.goals) {
        inserts.push(supabaseAdmin.from('goals').insert(input.goals.map(g => ({ ...g, user_id: req.user.id }))));
      }
      await Promise.all(inserts);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: "Invalid backup data" });
    }
  });

  // === PROFILE ===
  app.get("/api/profile", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const profile = await storage.getProfile(req.user.id);
      res.json(profile || { height: 180, weight: 75 });
    } catch (err) {
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "غير مصرح" });
    try {
      const { height, weight } = req.body;
      
      if (!height || !weight) {
        return res.status(400).json({ message: "الطول والوزن مطلوبان" });
      }

      const heightNum = parseFloat(height);
      const weightNum = parseFloat(weight);

      if (isNaN(heightNum) || isNaN(weightNum) || heightNum <= 0 || weightNum <= 0) {
        return res.status(400).json({ message: "قيم غير صحيحة" });
      }

      await storage.saveProfile(req.user.id, { height: heightNum, weight: weightNum });
      res.json({ height: heightNum, weight: weightNum });
    } catch (err) {
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  if (!supabaseAdmin) return; // Skip seeding if not using Supabase

  const { data: existingWorkouts } = await supabaseAdmin.from('workouts').select('id').limit(1);
  if (existingWorkouts && existingWorkouts.length > 0) return;

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  // Seed Workouts (Last 4 weeks)
  const workoutTypes = ['Push', 'Pull', 'Legs', 'Cardio', 'Skills', 'Mobility'];
  const exercises = {
    'Push': ['Pushups', 'Dips', 'Bench Press'],
    'Pull': ['Pullups', 'Rows', 'Deadlift'],
    'Legs': ['Squats', 'Lunges', 'Calf Raises'],
    'Cardio': ['Running', 'Cycling', 'Jump Rope'],
    'Skills': ['Handstand Practice', 'L-Sit', 'Planche Lean'],
    'Mobility': ['Full Body Stretch', 'Hip Opener', 'Shoulder Mobility']
  };

  for (let i = 0; i < 28; i++) {
    if (Math.random() > 0.3) { // 70% chance to workout
      const date = new Date(now.getTime() - i * oneDay);
      const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      // @ts-ignore
      const exerciseList = exercises[type];
      const exercise = exerciseList[Math.floor(Math.random() * exerciseList.length)];
      
      await supabaseAdmin.from('workouts').insert({
        date: date,
        type: type,
        exercise: exercise,
        sets: Math.floor(Math.random() * 3) + 3,
        reps: Math.floor(Math.random() * 5) + 8,
        minutes: Math.floor(Math.random() * 45) + 15,
        user_id: 'seed' // or null, but assuming string
      });
    }
  }

  // Seed Calories (Last 7 days)
  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getTime() - i * oneDay);
    await supabaseAdmin.from('calories').insert({
      date: date,
      caloriesIn: Math.floor(Math.random() * 500) + 2000,
      caloriesOut: Math.floor(Math.random() * 500) + 2000,
      user_id: 'seed'
    });
  }

  // Seed Progress (Last 4 weeks, once a week)
  for (let i = 0; i < 4; i++) {
    const date = new Date(now.getTime() - (i * 7) * oneDay);
    await supabaseAdmin.from('progress').insert({
      date: date,
      weight: (75 + Math.random() * 2 - 1).toFixed(1),
      pullupsMax: Math.floor(Math.random() * 5) + 10 + i,
      dipsMax: Math.floor(Math.random() * 5) + 15 + i,
      handstandSeconds: Math.floor(Math.random() * 10) + 20 + i * 2,
      user_id: 'seed'
    });
  }
}
