import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useAnimatedNumber, useCountUp } from "@/hooks/use-animated-number";
import { useReduceMotion } from "@/hooks/use-reduce-motion";
import { cardHover, fadeIn } from "@/lib/animations";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  subtitle?: string; // Compatibility
  trend?: string; // Compatibility
  color?: "primary" | "success" | "warning" | "danger";
  animateValue?: boolean; // تفعيل تحريك الأرقام
  isLoading?: boolean;
  suffix?: string;
  prefix?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  color = "primary",
  animateValue = true,
  isLoading = false,
  suffix = "",
  prefix = ""
}: StatsCardProps) {
  const { isRTL } = useLanguage();
  const prefersReducedMotion = useReduceMotion();
  const numericValue = typeof value === "number" ? value : 0;
  const displayValue = animateValue && typeof value === "number" 
    ? useCountUp({ 
        value: numericValue, 
        duration: prefersReducedMotion ? 0.3 : 0.8,
        suffix,
        prefix
      })
    : value;

  const colorStyles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <motion.div 
      className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-border bg-card"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      whileHover={!prefersReducedMotion ? cardHover.whileHover : {}}
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.3 }}
    >
      <div className={cn(
        "absolute top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110",
        isRTL ? "left-0" : "right-0"
      )}>
        <Icon size={80} />
      </div>

      <div className="relative z-10">
        <motion.div 
          className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 border", colorStyles[color])}
          whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
          whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
        >
          <Icon size={24} />
        </motion.div>
        
        <p className="text-muted-foreground font-medium text-sm">{title}</p>
        {isLoading ? (
          <div className="h-8 mt-1 bg-muted rounded-lg w-20 animate-pulse" />
        ) : (
          <h3 className="text-3xl font-bold mt-1 tracking-tight">{displayValue}</h3>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground/80 mt-2">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
