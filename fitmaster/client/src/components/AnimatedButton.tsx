import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: ReactNode;
  isLoading?: boolean;
  successIcon?: ReactNode;
  showSuccess?: boolean;
}

export function AnimatedButton({
  children,
  variant = "default",
  size = "default",
  icon,
  isLoading = false,
  successIcon,
  showSuccess = false,
  disabled,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const prefersReducedMotion = useReduceMotion();

  const hoverVariants = {
    hover: {
      scale: prefersReducedMotion ? 1 : 1.05,
      boxShadow: prefersReducedMotion
        ? undefined
        : "0 10px 20px rgba(0, 0, 0, 0.1)",
    },
  };

  const tapVariants = {
    tap: {
      scale: prefersReducedMotion ? 1 : 0.95,
    },
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const successVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      whileHover={!disabled ? hoverVariants.hover : {}}
      whileTap={!disabled ? tapVariants.tap : {}}
      className="inline-block"
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        className={`relative ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <motion.span
              animate="animate"
              variants={loadingVariants}
              className="inline-block mr-2"
            >
              ⟳
            </motion.span>
            جاري...
          </>
        ) : showSuccess ? (
          <>
            <motion.span
              initial="initial"
              animate="animate"
              variants={successVariants}
              className="inline-block mr-2"
            >
              ✓
            </motion.span>
            تم بنجاح
          </>
        ) : (
          <>
            {icon && <span className="inline-block mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    </motion.div>
  );
}

/**
 * زر مع شرح (Tooltip) عند Hover
 */
interface TooltipButtonProps extends AnimatedButtonProps {
  tooltip?: string;
}

export function TooltipButton({
  tooltip,
  ...props
}: TooltipButtonProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className="relative inline-block">
      <AnimatedButton
        {...props}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />

      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={
            showTooltip
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: -10 }
          }
          transition={{ duration: 0.2 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap pointer-events-none"
        >
          {tooltip}
        </motion.div>
      )}
    </div>
  );
}

import React from "react";
