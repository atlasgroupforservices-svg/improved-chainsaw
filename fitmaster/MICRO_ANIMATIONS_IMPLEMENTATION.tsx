// 🎯 MICRO_ANIMATIONS_IMPLEMENTATION.tsx
// كيفية تطبيق Micro-Animations على الصفحات الفعلية

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useReduceMotion } from "@/hooks/use-reduce-motion";
import { useCountUp } from "@/hooks/use-animated-number";

// =============================================================================
// 1️⃣ DASHBOARD PAGE - التطبيق العملي الكامل
// =============================================================================

export function DashboardWithAnimations() {
  const prefersReducedMotion = useReduceMotion();
  const [showToast, setShowToast] = useState(false);

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: !prefersReducedMotion ? { scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } : {}
  };

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">مرحباً بعودتك 👋</p>
      </motion.div>

      {/* ===== Stats Grid ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Training Hours Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.3 }}
          className="p-6 bg-card rounded-lg border cursor-pointer"
        >
          <p className="text-sm text-muted-foreground mb-2">ساعات التدريب</p>
          <AnimatedNumberDisplay value={5.5} suffix="h" duration={0.8} />
          <p className="text-xs text-muted-foreground mt-3">هذا الأسبوع</p>
        </motion.div>

        {/* Weekly Goal Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6 bg-card rounded-lg border cursor-pointer"
        >
          <p className="text-sm text-muted-foreground mb-2">الهدف الأسبوعي</p>
          <ProgressWithAnimation value={75} />
        </motion.div>

        {/* Streak Card */}
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-6 bg-card rounded-lg border cursor-pointer"
        >
          <p className="text-sm text-muted-foreground mb-2">السلسلة</p>
          <StreakDisplay count={12} animated />
        </motion.div>
      </div>

      {/* ===== Action Button with Feedback ===== */}
      <div>
        <motion.button
          onClick={() => setShowToast(true)}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
          whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
          whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
          transition={{ duration: 0.2 }}
        >
          أضف تمرين جديد
        </motion.button>
      </div>

      {/* ===== Toast Notification ===== */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 p-4 bg-emerald-500 text-white rounded-lg"
          >
            ✅ تمت إضافة التمرين بنجاح!
            <button
              onClick={() => setShowToast(false)}
              className="ml-3 text-sm opacity-80 hover:opacity-100"
            >
              إغلاق
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// 2️⃣ WORKOUTS PAGE - قائمة مع Hover Animations
// =============================================================================

export function WorkoutsPageWithAnimations() {
  const prefersReducedMotion = useReduceMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const workouts = [
    { id: "1", name: "تمرين الصدر", duration: "45 دقيقة", calories: 250 },
    { id: "2", name: "تمرين الظهر", duration: "50 دقيقة", calories: 280 },
    { id: "3", name: "تمرين الأرجل", duration: "60 دقيقة", calories: 320 }
  ];

  return (
    <div className="space-y-4">
      {workouts.map((workout, index) => (
        <motion.div
          key={workout.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onHoverStart={() => setHoveredId(workout.id)}
          onHoverEnd={() => setHoveredId(null)}
          whileHover={
            !prefersReducedMotion
              ? { scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }
              : {}
          }
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            hoveredId === workout.id ? "border-primary" : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{workout.name}</p>
              <p className="text-sm text-muted-foreground">{workout.duration}</p>
            </div>
            <motion.div
              animate={
                hoveredId === workout.id
                  ? !prefersReducedMotion
                    ? { x: 5 }
                    : {}
                  : {}
              }
              className="text-right"
            >
              <p className="font-bold text-primary">{workout.calories} سعرة</p>
              <motion.span
                animate={
                  hoveredId === workout.id
                    ? !prefersReducedMotion
                      ? { scale: 1.2 }
                      : {}
                    : {}
                }
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// 3️⃣ CALORIES PAGE - مع Input Validation Animation
// =============================================================================

export function CaloriesPageWithAnimations() {
  const prefersReducedMotion = useReduceMotion();
  const [inputValue, setInputValue] = useState("");
  const [validationStatus, setValidationStatus] = useState<"idle" | "error" | "success">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setValidationStatus("idle");
    } else if (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 5000) {
      setValidationStatus("error");
    } else {
      setValidationStatus("success");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">إضافة السعرات</h2>

      {/* Input with Validation Animation */}
      <motion.div
        animate={
          validationStatus === "error"
            ? !prefersReducedMotion
              ? { x: [-10, 10, -10, 10, 0] }
              : {}
            : {}
        }
        transition={{ duration: 0.4 }}
        className={`relative`}
      >
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="أدخل عدد السعرات (0-5000)"
          className={`w-full p-3 rounded-lg border-2 transition-colors ${
            validationStatus === "error"
              ? "border-red-500 bg-red-50"
              : validationStatus === "success"
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-300"
          }`}
        />

        {/* Validation Icon */}
        <motion.span
          animate={
            validationStatus !== "idle"
              ? !prefersReducedMotion
                ? { scale: [0, 1.2, 1], opacity: 1 }
                : { opacity: 1 }
              : { opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="absolute right-3 top-3 text-lg"
        >
          {validationStatus === "error" && "❌"}
          {validationStatus === "success" && "✅"}
        </motion.span>
      </motion.div>

      {/* Error Message with Animation */}
      <AnimatePresence>
        {validationStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            ⚠️ أدخل قيمة صحيحة بين 0 و 5000
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {validationStatus === "success" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
            whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
            onClick={() => {
              setInputValue("");
              setValidationStatus("idle");
            }}
            className="w-full p-3 bg-primary text-white rounded-lg font-medium transition-all"
          >
            ✅ إضافة السعرات
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// 4️⃣ PROGRESS PAGE - Progress Bar مع Animation
// =============================================================================

export function ProgressPageWithAnimations() {
  const prefersReducedMotion = useReduceMotion();
  const [progress, setProgress] = useState(65);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">التقدم الأسبوعي</h2>

      {/* Progress Container */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">الهدف: 8 ساعات</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>

        {/* Progress Bar Background */}
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* Animated Progress Fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            animate={{ width: `${progress}%` }}
            transition={{
              duration: progress >= 90 ? 1.5 : 0.8,
              ease: progress >= 90 ? "easeOut" : "easeInOut"
            }}
          />
        </div>

        {/* Animation Info */}
        <p className="text-xs text-muted-foreground mt-2">
          {progress >= 90
            ? "قرب! الحركة تبطأ عند الاقتراب من الهدف"
            : "يتحرك بسلاسة نحو الهدف"}
        </p>
      </div>

      {/* Completion Celebration */}
      {progress >= 100 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="p-6 bg-emerald-100 border border-emerald-300 rounded-lg text-center"
        >
          <motion.span
            animate={!prefersReducedMotion ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.6, repeat: 2 }}
            className="text-4xl inline-block"
          >
            🎉
          </motion.span>
          <h3 className="text-lg font-bold text-emerald-700 mt-3">
            تهانينا! وصلت إلى الهدف!
          </h3>
          <p className="text-emerald-600 text-sm mt-1">
            استمتع بتمرينك وحافظ على الحافز
          </p>
        </motion.div>
      )}

      {/* Button to Adjust Progress */}
      <div className="flex gap-2">
        <motion.button
          onClick={() => setProgress(Math.max(0, progress - 10))}
          whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          -
        </motion.button>
        <motion.button
          onClick={() => setProgress(Math.min(100, progress + 10))}
          whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}

// =============================================================================
// 🛠️ HELPER COMPONENTS
// =============================================================================

// Animated Number Display
function AnimatedNumberDisplay({
  value,
  suffix = "",
  duration = 0.8
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const displayValue = useCountUp({
    value,
    duration,
    suffix
  });

  return (
    <motion.h3 className="text-3xl font-bold text-primary">
      {displayValue}
    </motion.h3>
  );
}

// Progress Bar with Animation
function ProgressWithAnimation({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <p className="text-sm font-medium">{value}%</p>
    </div>
  );
}

// Streak Display with Icon Animation
function StreakDisplay({ count, animated = false }: { count: number; animated?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.span
        animate={
          animated ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}
        }
        transition={{ duration: 0.6 }}
        className="text-3xl"
      >
        🔥
      </motion.span>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs text-muted-foreground">أيام متتالية</p>
      </div>
    </div>
  );
}

// =============================================================================
// 🎯 SUMMARY - النقاط المهمة
// =============================================================================

/*
✅ تم تطبيق:
1. Hover animations على الـ Cards (scale + shadow)
2. Number animations على الأرقام (useCountUp)
3. Click/Tap feedback على الـ Buttons (scale 0.95)
4. Toast notifications (slide in/out)
5. Progress feedback (animated width)
6. Input validation (shake + icon animation)
7. Icon animations (rotate on streak)
8. Success states (celebration)
9. Accessibility (prefers-reduced-motion)

🎯 الخطوات التالية:
1. انسخ هذه الأمثلة إلى الصفحات الفعلية
2. اختبر على الجوال
3. تأكد من أن جميع الحركات مفيدة
4. اتبع القاعدة: "100-300ms للحركات السريعة"

💡 نصيحة:
لا تضف حركات كثيرة مرة واحدة.
ابدأ بـ Hover و Click feedback.
من بعد أضف الباقي تدريجياً.
*/
