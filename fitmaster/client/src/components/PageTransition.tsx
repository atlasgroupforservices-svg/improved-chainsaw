import { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * مكون لتطبيق حركات الانتقال بين الصفحات
 */
export function PageTransition({
  children,
  delay = 0,
  className = "",
}: PageTransitionProps) {
  const prefersReducedMotion = useReduceMotion();

  const variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : pageVariants;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0.2 : 0.4,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * مكون لتطبيق حركات على عناصر متعددة بتتابع
 */
interface StaggeredContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function StaggeredContainer({
  children,
  delay = 0,
  className = "",
}: StaggeredContainerProps) {
  const prefersReducedMotion = useReduceMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.4 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
