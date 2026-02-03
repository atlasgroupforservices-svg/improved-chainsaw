import { motion } from "framer-motion";
import { shimmerAnimation } from "@/lib/animations";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

export function SkeletonCard() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <motion.div
      className="rounded-2xl p-6 bg-muted overflow-hidden"
      animate={prefersReducedMotion ? { opacity: 0.5 } : shimmerAnimation.animate}
      style={{
        backgroundImage: prefersReducedMotion
          ? undefined
          : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.2) 20%, rgba(255,255,255,0) 40%)",
        backgroundSize: "200% 100%",
      }}
    >
      <div className="space-y-4">
        <div className="h-4 bg-background/50 rounded w-1/2" />
        <div className="h-8 bg-background/50 rounded w-3/4" />
        <div className="h-4 bg-background/50 rounded w-full" />
      </div>
    </motion.div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  const prefersReducedMotion = useReduceMotion();

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          className="h-12 rounded-lg bg-muted overflow-hidden"
          animate={prefersReducedMotion ? { opacity: 0.5 } : shimmerAnimation.animate}
          style={{
            backgroundImage: prefersReducedMotion
              ? undefined
              : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.2) 20%, rgba(255,255,255,0) 40%)",
            backgroundSize: "200% 100%",
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <motion.div
      className="w-full h-64 rounded-2xl bg-muted overflow-hidden"
      animate={prefersReducedMotion ? { opacity: 0.5 } : shimmerAnimation.animate}
      style={{
        backgroundImage: prefersReducedMotion
          ? undefined
          : "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.2) 20%, rgba(255,255,255,0) 40%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
