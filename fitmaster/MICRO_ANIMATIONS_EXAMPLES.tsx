/**
 * 🎯 Micro-Animations Practical Guide
 * أمثلة عملية لكل نوع من الحركات الصغيرة
 */

import { motion } from "framer-motion";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

// ============================================
// 1️⃣ HOVER ANIMATIONS (Desktop)
// ============================================

/**
 * Card Hover - Scale + Shadow
 * فين؟ Cards, Buttons, Sidebar items
 * شنو يقع؟ Scale خفيف (1 → 1.02) + Shadow
 */
export function HoverCardExample() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <motion.div
      className="p-6 bg-card rounded-lg border border-border cursor-pointer"
      whileHover={
        !prefersReducedMotion
          ? {
              scale: 1.02, // Scale خفيف جداً
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2, ease: "easeOut" },
            }
          : {}
      }
    >
      <h3 className="font-semibold">Training Hours</h3>
      <p className="text-2xl font-bold text-primary">5.5h</p>
    </motion.div>
  );
}

/**
 * Button Hover - Color + Shadow
 */
export function HoverButtonExample() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <motion.button
      className="px-4 py-2 bg-primary text-white rounded-lg"
      whileHover={
        !prefersReducedMotion
          ? {
              backgroundColor: "rgb(59, 130, 246)", // أفتح قليلاً
              boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
              transition: { duration: 0.2 },
            }
          : {}
      }
    >
      إضافة تمرين
    </motion.button>
  );
}

// ============================================
// 2️⃣ CLICK / TAP FEEDBACK
// ============================================

/**
 * Press Animation - Scale down on click
 * عند الضغط: الزر ينقص شوية فالحجم
 */
export function ClickFeedbackExample() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <motion.button
      className="px-6 py-3 bg-success text-white rounded-lg font-semibold"
      whileTap={
        !prefersReducedMotion
          ? {
              scale: 0.95, // Shrink قليلاً
              transition: { duration: 0.1 },
            }
          : {}
      }
      whileHover={
        !prefersReducedMotion
          ? {
              scale: 1.05,
            }
          : {}
      }
    >
      حفظ
    </motion.button>
  );
}

/**
 * Icon Click Animation - Icon يتحرك شوية
 */
export function IconClickExample() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <motion.div
      whileTap={
        !prefersReducedMotion
          ? {
              y: 2, // تحرك 2px لتحت
              transition: { duration: 0.1 },
            }
          : {}
      }
      className="inline-flex items-center gap-2"
    >
      <motion.span
        whileTap={
          !prefersReducedMotion
            ? {
                rotate: 10, // دوران خفيف
              }
            : {}
        }
      >
        🔥
      </motion.span>
      <span>Streak: 15</span>
    </motion.div>
  );
}

// ============================================
// 3️⃣ CARD HIGHLIGHT ANIMATION
// ============================================

/**
 * Card Highlight - عندما تتحدّث قيمة
 * السيناريو: دخلت Workout جديد
 * Card ديال Training Hours تتحدّث
 */
export function CardHighlightExample() {
  const prefersReducedMotion = useReduceMotion();
  const [shouldHighlight, setShouldHighlight] = React.useState(false);

  const handleUpdate = () => {
    setShouldHighlight(true);
    setTimeout(() => setShouldHighlight(false), 600);
  };

  return (
    <div>
      <motion.div
        className="p-6 bg-card rounded-lg border border-border"
        animate={
          shouldHighlight && !prefersReducedMotion
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                  "0 0 20px 10px rgba(59, 130, 246, 0.5)",
                  "0 0 0 0 rgba(59, 130, 246, 0)",
                ],
                borderColor: "rgb(59, 130, 246)",
              }
            : {}
        }
        transition={
          !prefersReducedMotion ? { duration: 0.6, ease: "easeOut" } : {}
        }
      >
        <p className="text-muted-foreground">Training Hours</p>
        <h3 className="text-3xl font-bold text-primary">5.5h</h3>
      </motion.div>

      <button
        onClick={handleUpdate}
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
      >
        Simulate Update
      </button>
    </div>
  );
}

// ============================================
// 4️⃣ NUMBER CHANGE ANIMATION (مهمة جداً)
// ============================================

/**
 * Number Counter - 3.0h → 4.5h (مع animation)
 * المستخدم يحس بالتقدم
 */
export function NumberChangeExample() {
  const prefersReducedMotion = useReduceMotion();
  const [currentValue, setCurrentValue] = React.useState(3.0);
  const displayValue = useAnimatedNumber({
    value: currentValue,
    duration: prefersReducedMotion ? 0.3 : 1,
    format: (v) => v.toFixed(1),
  });

  return (
    <div className="space-y-4">
      <div className="p-6 bg-card rounded-lg border">
        <p className="text-muted-foreground">Training Hours</p>
        <motion.h3 className="text-3xl font-bold text-primary">
          {displayValue}h
        </motion.h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentValue(3.0)}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          3.0h
        </button>
        <button
          onClick={() => setCurrentValue(4.5)}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          4.5h
        </button>
        <button
          onClick={() => setCurrentValue(7.2)}
          className="px-3 py-2 bg-gray-200 rounded"
        >
          7.2h
        </button>
      </div>
    </div>
  );
}

// ============================================
// 5️⃣ PROGRESS FEEDBACK ANIMATION
// ============================================

/**
 * Progress - يتحرك تدريجياً مشي Jump
 * قرب من الهدف → الحركة تبطأ
 * وصل 100% → Pulse صغير 🎉
 */
export function ProgressFeedbackExample() {
  const prefersReducedMotion = useReduceMotion();
  const [progress, setProgress] = React.useState(65);
  const isNearGoal = progress >= 90;
  const isComplete = progress === 100;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Weekly Goal Progress</label>
        <div className="h-3 bg-muted rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/50"
            animate={{ width: `${progress}%` }}
            transition={
              !prefersReducedMotion
                ? {
                    duration: isNearGoal ? 1.5 : 0.8, // بطأ عندما قرب
                    ease: isNearGoal ? "easeOut" : "easeInOut",
                  }
                : {}
            }
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
      </div>

      {isComplete && !prefersReducedMotion && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl"
        >
          🎉 تهانينا! وصلت الهدف
        </motion.div>
      )}

      <div className="flex gap-2">
        {[30, 65, 90, 100].map((val) => (
          <button
            key={val}
            onClick={() => setProgress(val)}
            className="px-3 py-2 bg-gray-200 rounded text-sm"
          >
            {val}%
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 6️⃣ ICON ANIMATIONS
// ============================================

/**
 * Icon Animation - Flame يتحرك عند زيادة Streak
 * مرة وحدة فقط، مشي Loop
 */
export function IconAnimationExample() {
  const prefersReducedMotion = useReduceMotion();
  const [streak, setStreak] = React.useState(0);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  const handleIncreaseStreak = () => {
    setStreak((s) => s + 1);
    setShouldAnimate(true);
    setTimeout(() => setShouldAnimate(false), 600);
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-card rounded-lg border flex items-center gap-3">
        <motion.div
          animate={
            shouldAnimate && !prefersReducedMotion
              ? {
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }
              : {}
          }
          transition={
            !prefersReducedMotion ? { duration: 0.6, ease: "easeInOut" } : {}
          }
        >
          🔥
        </motion.div>
        <div>
          <p className="text-muted-foreground text-sm">Current Streak</p>
          <p className="text-2xl font-bold">{streak}</p>
        </div>
      </div>

      <button
        onClick={handleIncreaseStreak}
        className="px-4 py-2 bg-danger text-white rounded"
      >
        Add to Streak
      </button>
    </div>
  );
}

// ============================================
// 7️⃣ TOAST / NOTIFICATION ANIMATION
// ============================================

/**
 * Toast - Slide In من الفوق + Fade Out
 * عند إضافة تمرين أو خطأ
 */
export function ToastNotificationExample() {
  const prefersReducedMotion = useReduceMotion();
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    if (showToast && !prefersReducedMotion) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast, prefersReducedMotion]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowToast(true)}
        className="px-4 py-2 bg-success text-white rounded"
      >
        Show Toast
      </button>

      {showToast && (
        <motion.div
          initial={
            !prefersReducedMotion
              ? { opacity: 0, y: -50 }
              : { opacity: 1, y: 0 }
          }
          animate={
            !prefersReducedMotion ? { opacity: 1, y: 0 } : {}
          }
          exit={
            !prefersReducedMotion
              ? { opacity: 0, y: -50 }
              : { opacity: 1, y: 0 }
          }
          transition={
            !prefersReducedMotion
              ? { duration: 0.3, ease: "easeOut" }
              : {}
          }
          className="fixed top-4 right-4 p-4 bg-success text-white rounded-lg shadow-lg"
        >
          ✅ تمت إضافة التمرين بنجاح!
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// 8️⃣ INPUT VALIDATION ANIMATION
// ============================================

/**
 * Input Validation - Shake on error
 * خطأ: Shake + Border أحمر + Icon ❌
 * نجاح: Border أخضر + Icon ✔️
 */
export function InputValidationExample() {
  const prefersReducedMotion = useReduceMotion();
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "error" | "success">(
    "idle"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (newValue === "") {
      setStatus("idle");
    } else if (isNaN(Number(newValue)) || Number(newValue) < 0) {
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        animate={
          status === "error" && !prefersReducedMotion
            ? {
                x: [-10, 10, -10, 10, 0],
              }
            : {}
        }
        transition={
          !prefersReducedMotion ? { duration: 0.4 } : {}
        }
        className={`flex items-center border-2 rounded-lg p-3 transition-colors ${
          status === "error"
            ? "border-red-500 bg-red-50"
            : status === "success"
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-200"
        }`}
      >
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder="أدخل السعرات"
          className="flex-1 bg-transparent outline-none"
        />

        <motion.span
          animate={
            (status === "error" || status === "success") && !prefersReducedMotion
              ? { scale: [0, 1.2, 1] }
              : {}
          }
          transition={
            !prefersReducedMotion
              ? { duration: 0.3, type: "spring" }
              : {}
          }
        >
          {status === "error" && "❌"}
          {status === "success" && "✔️"}
        </motion.span>
      </motion.div>

      {status === "error" && (
        <motion.p
          initial={!prefersReducedMotion ? { opacity: 0 } : {}}
          animate={!prefersReducedMotion ? { opacity: 1 } : {}}
          className="text-sm text-red-600"
        >
          يجب أن تدخل رقم موجب
        </motion.p>
      )}
    </div>
  );
}

// ============================================
// 9️⃣ LOADING MICRO-ANIMATIONS
// ============================================

/**
 * Loading - Line تتحرك
 * Skeleton Pulse خفيف
 */
export function LoadingMicroAnimationExample() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <div className="space-y-4">
      {/* Line Animation */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          animate={
            !prefersReducedMotion
              ? {
                  x: ["-100%", "100%"],
                }
              : {}
          }
          transition={
            !prefersReducedMotion
              ? { duration: 1.5, repeat: Infinity }
              : {}
          }
        />
      </div>

      {/* Skeleton Pulse */}
      <motion.div
        className="p-6 bg-muted rounded-lg"
        animate={
          !prefersReducedMotion
            ? {
                opacity: [0.5, 0.8, 0.5],
              }
            : { opacity: 0.6 }
        }
        transition={
          !prefersReducedMotion
            ? { duration: 2, repeat: Infinity }
            : {}
        }
      >
        <div className="h-4 bg-background/50 rounded w-3/4 mb-3" />
        <div className="h-8 bg-background/50 rounded w-1/2" />
      </motion.div>
    </div>
  );
}

// ============================================
// 🎯 DASHBOARD COMPLETE EXAMPLE
// ============================================

/**
 * مثال شامل يجمع كل الـ Micro-Animations
 */
export function CompleteMicroAnimationsExample() {
  const prefersReducedMotion = useReduceMotion();
  const [stats, setStats] = React.useState({
    calories: 2500,
    hours: 5.5,
    streak: 15,
    weeklyProgress: 75,
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards مع Hover */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <motion.div
            key={key}
            className="p-4 bg-card rounded-lg border border-border cursor-pointer"
            whileHover={
              !prefersReducedMotion
                ? {
                    scale: 1.02,
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  }
                : {}
            }
          >
            <p className="text-sm text-muted-foreground capitalize">{key}</p>
            <motion.p className="text-2xl font-bold">{value}</motion.p>
          </motion.div>
        ))}
      </div>

      {/* Input مع Validation */}
      <InputValidationExample />

      {/* Progress مع Feedback */}
      <ProgressFeedbackExample />

      {/* Buttons مع Click Feedback */}
      <div className="flex gap-2">
        <motion.button
          className="px-4 py-2 bg-primary text-white rounded"
          whileTap={
            !prefersReducedMotion
              ? { scale: 0.95 }
              : {}
          }
        >
          حفظ
        </motion.button>

        <motion.button
          className="px-4 py-2 bg-gray-200 rounded"
          whileHover={
            !prefersReducedMotion
              ? { scale: 1.05 }
              : {}
          }
        >
          إلغاء
        </motion.button>
      </div>
    </div>
  );
}

// ============================================
// Import needed
// ============================================
import React from "react";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
