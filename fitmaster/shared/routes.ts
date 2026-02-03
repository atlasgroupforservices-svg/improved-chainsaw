import { z } from 'zod';
import { 
  insertWorkoutSchema, 
  workouts, 
  insertCalorieSchema, 
  calories, 
  insertProgressSchema, 
  progress, 
  insertGoalSchema, 
  goals 
} from './schema';

// === SHARED ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
export const api = {
  workouts: {
    list: {
      method: 'GET' as const,
      path: '/api/workouts',
      responses: {
        200: z.array(z.custom<typeof workouts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/workouts',
      input: insertWorkoutSchema,
      responses: {
        201: z.custom<typeof workouts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/workouts/:id',
      input: insertWorkoutSchema.partial(),
      responses: {
        200: z.custom<typeof workouts.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/workouts/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  calories: {
    list: {
      method: 'GET' as const,
      path: '/api/calories',
      responses: {
        200: z.array(z.custom<typeof calories.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/calories',
      input: insertCalorieSchema,
      responses: {
        201: z.custom<typeof calories.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/calories/:id',
      input: insertCalorieSchema.partial(),
      responses: {
        200: z.custom<typeof calories.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/calories/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  progress: {
    list: {
      method: 'GET' as const,
      path: '/api/progress',
      responses: {
        200: z.array(z.custom<typeof progress.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/progress',
      input: insertProgressSchema,
      responses: {
        201: z.custom<typeof progress.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/progress/:id',
      input: insertProgressSchema.partial(),
      responses: {
        200: z.custom<typeof progress.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/progress/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  goals: {
    list: {
      method: 'GET' as const,
      path: '/api/goals',
      responses: {
        200: z.array(z.custom<typeof goals.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/goals',
      input: insertGoalSchema,
      responses: {
        201: z.custom<typeof goals.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  backup: {
    export: {
      method: 'GET' as const,
      path: '/api/backup/export',
      responses: {
        200: z.object({
          workouts: z.array(z.any()),
          calories: z.array(z.any()),
          progress: z.array(z.any()),
          goals: z.array(z.any()),
        }),
      },
    },
    import: {
      method: 'POST' as const,
      path: '/api/backup/import',
      input: z.object({
        workouts: z.array(z.any()),
        calories: z.array(z.any()),
        progress: z.array(z.any()),
        goals: z.array(z.any()),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
      },
    },
  }
};

// === URL HELPER ===
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
