import { useEffect, useState } from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";

interface UseAnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  format?: (value: number) => string;
}

/**
 * Hook لتحريك الأرقام من 0 إلى القيمة المستهدفة
 * أو من القيمة القديمة إلى الجديدة
 */
export function useAnimatedNumber({
  value,
  duration = 1,
  delay = 0,
  format = (v) => Math.round(v).toString(),
}: UseAnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    // إنش821 animation من القيمة الحالية إلى القيمة الجديدة
    const controls = animate(motionValue, value, {
      duration,
      delay,
      onUpdate: (latest) => {
        setDisplayValue(format(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration, delay, format, motionValue]);

  return displayValue;
}

/**
 * Hook محسّن للأرقام التي تبدأ من 0
 */
export function useCountUp({
  value,
  duration = 0.8,
  delay = 0,
  suffix = "",
  prefix = "",
}: {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}) {
  const displayValue = useAnimatedNumber({
    value,
    duration,
    delay,
    format: (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`,
  });

  return displayValue;
}

/**
 * Hook لتحريك الأرقام العشرية (للسعرات، المسافة، إلخ)
 */
export function useDecimalCountUp({
  value,
  decimals = 1,
  duration = 0.8,
  delay = 0,
  suffix = "",
  prefix = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}) {
  const displayValue = useAnimatedNumber({
    value,
    duration,
    delay,
    format: (v) => {
      const formatted = v.toFixed(decimals);
      return `${prefix}${formatted}${suffix}`;
    },
  });

  return displayValue;
}
