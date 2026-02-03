import { useEffect, useState } from "react";

/**
 * Hook للتحقق من تفضيل المستخدم لتقليل الحركات
 * يساعد في احترام احتياجات المستخدمين ذوي الحساسية للحركة
 */
export function useReduceMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // التحقق من تفضيل النظام
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // الاستماع للتغييرات
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Helper function لتحديد مدة الحركة بناءً على تفضيل المستخدم
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedMotionDuration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? reducedMotionDuration : normalDuration;
}
