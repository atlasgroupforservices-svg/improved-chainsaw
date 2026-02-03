import { motion } from "framer-motion";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

interface AnimatedProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: "primary" | "success" | "warning" | "danger";
  showPercentage?: boolean;
  animated?: boolean;
  striped?: boolean;
  label?: string;
}

const colorMap = {
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export function AnimatedProgressBar({
  value,
  max = 100,
  color = "primary",
  showPercentage = true,
  animated = true,
  striped = false,
  label,
}: AnimatedProgressBarProps) {
  const prefersReducedMotion = useReduceMotion();
  const percentage = (value / max) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${percentage}%`,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30,
        duration: prefersReducedMotion ? 0.3 : 0.8,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {label && <p className="text-sm font-medium text-foreground mb-2">{label}</p>}

      <div className="flex items-center gap-2">
        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            variants={barVariants}
            className={`h-full ${colorMap[color]} rounded-full ${
              animated && !prefersReducedMotion
                ? "animate-pulse"
                : ""
            } ${
              striped && !prefersReducedMotion
                ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                : ""
            }`}
            style={{
              backgroundSize: "200% 100%",
              animation:
                striped && !prefersReducedMotion
                  ? "slide 2s linear infinite"
                  : undefined,
            }}
          />
        </div>

        {showPercentage && (
          <span className="text-sm font-semibold text-foreground min-w-12 text-right">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      <style>{`
        @keyframes slide {
          0% {
            background-position: 200% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }
      `}</style>
    </motion.div>
  );
}

/**
 * Progress Ring (Donut/Circular Progress)
 */
interface AnimatedProgressRingProps {
  value: number; // 0-100
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "success" | "warning" | "danger";
  showPercentage?: boolean;
  label?: string;
}

export function AnimatedProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "primary",
  showPercentage = true,
  label,
}: AnimatedProgressRingProps) {
  const prefersReducedMotion = useReduceMotion();
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  const ringVariants = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: offset,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30,
        duration: prefersReducedMotion ? 0.3 : 1,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorMap[color]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            variants={ringVariants}
          />
        </svg>

        {/* Center text */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {Math.round(percentage)}%
            </motion.span>
          </div>
        )}
      </div>

      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
    </motion.div>
  );
}

/**
 * Stacked Progress (multiple bars)
 */
interface StackedProgressProps {
  items: Array<{
    label: string;
    value: number;
    color: "primary" | "success" | "warning" | "danger";
  }>;
  max?: number;
}

export function StackedProgress({ items, max = 100 }: StackedProgressProps) {
  const total = items.reduce((acc, item) => acc + item.value, 0);
  const prefersReducedMotion = useReduceMotion();

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex-1 h-32 rounded-lg overflow-hidden bg-muted relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: prefersReducedMotion ? 0 : index * 0.1,
              duration: 0.4,
            }}
          >
            <motion.div
              className={`w-full ${colorMap[item.color]} absolute bottom-0`}
              initial={{ height: 0 }}
              animate={{
                height: `${(item.value / max) * 100}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                duration: prefersReducedMotion ? 0.3 : 0.8,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
