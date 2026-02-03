import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertProgressEntry, type ProgressEntry } from "@shared/schema";
import {
  createLocalProgress,
  deleteLocalProgress,
  getLocalProgress,
  updateLocalProgress,
} from "@/lib/local-data";

export function useProgress() {
  return useQuery({
    queryKey: [api.progress.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.progress.list.path);
        if (!res.ok) throw new Error("Failed to fetch progress entries");
        return api.progress.list.responses[200].parse(await res.json());
      } catch {
        return getLocalProgress();
      }
    },
  });
}

export function useCreateProgressEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProgressEntry) => {
      const payload = {
        ...data,
        weight: String(data.weight),
        pullupsMax: Number(data.pullupsMax),
        dipsMax: Number(data.dipsMax),
        handstandSeconds: Number(data.handstandSeconds),
        date: new Date(data.date).toISOString(),
      };

      try {
        const res = await fetch(api.progress.create.path, {
          method: api.progress.create.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to log progress");
        }
        return api.progress.create.responses[201].parse(await res.json());
      } catch {
        return createLocalProgress(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.progress.list.path] });
    },
  });
}

export function useUpdateProgressEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProgressEntry> }) => {
      const url = buildUrl(api.progress.update.path, { id });
      try {
        const res = await fetch(url, {
          method: api.progress.update.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update progress entry");
        return api.progress.update.responses[200].parse(await res.json());
      } catch {
        const updated = updateLocalProgress(id, data);
        if (!updated) throw new Error("Failed to update progress entry");
        return updated;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.progress.list.path] });
    },
  });
}

export function useDeleteProgressEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.progress.delete.path, { id });
      try {
        const res = await fetch(url, { method: api.progress.delete.method });
        if (!res.ok) throw new Error("Failed to delete entry");
      } catch {
        deleteLocalProgress(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.progress.list.path] });
    },
  });
}
