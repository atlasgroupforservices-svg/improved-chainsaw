/**
 * FitMaster Animations - Index File
 * جميع الـ exports في مكان واحد للسهولة
 */

// Hooks
export { useAnimatedNumber, useCountUp, useDecimalCountUp } from "@/hooks/use-animated-number";
export { useReduceMotion, getAnimationDuration } from "@/hooks/use-reduce-motion";

// Components - Animations
export { AnimatedToast, ToastContainer, useAnimatedToast } from "@/components/AnimatedToast";
export { PageTransition, StaggeredContainer } from "@/components/PageTransition";
export {
  AnimatedProgressBar,
  AnimatedProgressRing,
  StackedProgress,
} from "@/components/AnimatedProgress";
export { SkeletonCard, SkeletonTable, SkeletonChart, SkeletonStats } from "@/components/SkeletonLoader";
export { AnimatedButton, TooltipButton } from "@/components/AnimatedButton";
export { AnimatedInput } from "@/components/AnimatedInput";
export { EmptyState } from "@/components/EmptyState";
export { StatsCard } from "@/components/StatsCard";

// Animation Presets
export {
  fadeIn,
  slideInFromRight,
  slideInFromLeft,
  slideInFromTop,
  slideInFromBottom,
  scaleIn,
  pulse,
  bounce,
  rotate,
  hoverScale,
  cardHover,
  staggerContainer,
  staggerItem,
  shake,
  successBounce,
  pageVariants,
  gradientAnimation,
  shimmerAnimation,
} from "@/lib/animations";

// Framer Motion (re-export for convenience)
export { motion, AnimatePresence } from "framer-motion";
