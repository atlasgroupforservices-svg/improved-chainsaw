import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "@/hooks/use-reduce-motion";
import { Check, AlertCircle } from "lucide-react";

interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export const AnimatedInput = React.forwardRef<
  HTMLInputElement,
  AnimatedInputProps
>(
  (
    {
      label,
      error,
      success,
      icon,
      description,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReduceMotion();
    const [focused, setFocused] = React.useState(false);

    const errorVariants = {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground block">
            {label}
          </label>
        )}

        <motion.div
          initial={false}
          animate={{
            borderColor: error
              ? "rgb(239, 68, 68)"
              : success
                ? "rgb(16, 185, 129)"
                : "rgb(229, 231, 235)",
            boxShadow: focused
              ? error
                ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                : success
                  ? "0 0 0 3px rgba(16, 185, 129, 0.1)"
                  : "0 0 0 3px rgba(59, 130, 246, 0.1)"
              : "none",
          }}
          className={cn(
            "relative flex items-center border rounded-lg transition-colors duration-200",
            "bg-background",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {icon && (
            <span className="px-3 py-2 text-muted-foreground">{icon}</span>
          )}

          <input
            ref={ref}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              "flex-1 px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground outline-none",
              icon && "pl-0"
            )}
            {...props}
          />

          {success && !error && (
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0 }}
              animate={prefersReducedMotion ? {} : { scale: 1 }}
              className="px-3 py-2 text-emerald-500"
            >
              <Check size={18} />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={prefersReducedMotion ? {} : { scale: 0 }}
              animate={prefersReducedMotion ? {} : { scale: 1 }}
              className="px-3 py-2 text-red-500"
            >
              <AlertCircle size={18} />
            </motion.div>
          )}
        </motion.div>

        {error && (
          <motion.p
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            className="text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle size={14} />
            {error}
          </motion.p>
        )}

        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";
