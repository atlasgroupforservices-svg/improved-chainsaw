import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { fadeIn, scaleIn } from "@/lib/animations";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  subtitle?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  subtitle,
  children,
}: EmptyStateProps) {
  const prefersReducedMotion = useReduceMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? { visible: { opacity: 1 } } : containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="mb-6 relative"
      >
        <motion.div
          initial={prefersReducedMotion ? {} : { scale: 0.5, opacity: 0 }}
          animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center relative mx-auto">
            <Icon size={40} className="text-muted-foreground" />
          </div>
        </motion.div>
      </motion.div>

      <motion.h3
        variants={itemVariants}
        className="text-xl font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        variants={itemVariants}
        className="text-muted-foreground max-w-sm mb-2"
      >
        {description}
      </motion.p>

      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="text-sm text-muted-foreground/70 mb-6"
        >
          {subtitle}
        </motion.p>
      )}

      {action && (
        <motion.div variants={itemVariants} className="mt-4">
          <Button
            onClick={action.onClick}
            className="gap-2"
          >
            {action.label}
          </Button>
        </motion.div>
      )}

      {children && (
        <motion.div variants={itemVariants} className="mt-6 w-full">
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
