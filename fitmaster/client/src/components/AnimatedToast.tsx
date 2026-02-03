import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

export type ToastType = "success" | "error" | "warning" | "info";

interface AnimatedToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500/90",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-950",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-500/90",
    borderColor: "border-red-500",
    textColor: "text-red-950",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-500/90",
    borderColor: "border-amber-500",
    textColor: "text-amber-950",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/90",
    borderColor: "border-blue-500",
    textColor: "text-blue-950",
  },
};

export function AnimatedToast({
  id,
  message,
  type = "info",
  onClose,
  duration = 4000,
}: AnimatedToastProps) {
  const prefersReducedMotion = useReduceMotion();
  const config = toastConfig[type];
  const Icon = config.icon;

  // إغلاق تلقائي بعد المدة المحددة
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const variants = {
    hidden: { opacity: 0, y: -50, x: 0 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={prefersReducedMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } } : variants}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bgColor} ${config.borderColor} backdrop-blur-sm shadow-lg`}
    >
      <Icon size={20} className={config.textColor} />
      <span className={`flex-1 ${config.textColor}`}>{message}</span>
      <button
        onClick={() => onClose(id)}
        className={`p-1 hover:bg-white/20 rounded transition-colors ${config.textColor}`}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <AnimatedToast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook للتحكم بـ Toasts
import React from "react";

export function useAnimatedToast() {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string;
      message: string;
      type: ToastType;
    }>
  >([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string) => addToast(message, "success");
  const error = (message: string) => addToast(message, "error");
  const warning = (message: string) => addToast(message, "warning");
  const info = (message: string) => addToast(message, "info");

  return { toasts, addToast, removeToast, success, error, warning, info };
}
