import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCalorieEntry, type CalorieEntry } from "@shared/schema";

export function useCalories() {
  return useQuery({
    queryKey: [api.calories.list.path],
    queryFn: async () => {
      const res = await fetch(api.calories.list.path);
      if (!res.ok) throw new Error("Failed to fetch calorie entries");
      return api.calories.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCalorieEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCalorieEntry) => {
      const payload = {
        ...data,
        caloriesIn: Number(data.caloriesIn),
        caloriesOut: Number(data.caloriesOut),
        date: new Date(data.date).toISOString(),
      };

      const res = await fetch(api.calories.create.path, {
        method: api.calories.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to log calories");
      }
      return api.calories.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calories.list.path] });
    },
  });
}

export function useUpdateCalorieEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCalorieEntry> }) => {
      const url = buildUrl(api.calories.update.path, { id });
      const res = await fetch(url, {
        method: api.calories.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update calorie entry");
      return api.calories.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calories.list.path] });
    },
  });
}

export function useDeleteCalorieEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.calories.delete.path, { id });
      const res = await fetch(url, { method: api.calories.delete.method });
      if (!res.ok) throw new Error("Failed to delete entry");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calories.list.path] });
    },
  });
}
