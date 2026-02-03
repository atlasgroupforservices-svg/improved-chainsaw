import { useQuery } from "@tanstack/react-query";
import { getLocalProfile, saveLocalProfile } from "@/lib/local-data";

export interface ProfileData {
  height: number;
  weight: number;
}

export function useProfile() {
  return useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        if (typeof data?.height === "number" && typeof data?.weight === "number") {
          saveLocalProfile({ height: data.height, weight: data.weight });
        }
        return data;
      } catch {
        return getLocalProfile();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

export function calculateBMI(height: number, weight: number): number {
  // height in cm, weight in kg
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function getBMICategory(bmi: number): {
  label: string;
  color: string;
  ar: string;
} {
  if (bmi < 18.5) {
    return { label: "Underweight", color: "text-blue-500", ar: "نقص الوزن" };
  } else if (bmi < 25) {
    return { label: "Normal", color: "text-green-500", ar: "وزن طبيعي" };
  } else if (bmi < 30) {
    return { label: "Overweight", color: "text-yellow-500", ar: "زيادة الوزن" };
  } else {
    return { label: "Obese", color: "text-red-500", ar: "سمنة" };
  }
}
