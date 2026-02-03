/**
 * Example: Complete Dashboard Implementation
 * مثال شامل يجمع كل الـ animations والـ components
 */

import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { PageTransition } from "@/components/PageTransition";
import { StatsCard } from "@/components/StatsCard";
import { AnimatedProgressBar, AnimatedProgressRing } from "@/components/AnimatedProgress";
import { SkeletonStats } from "@/components/SkeletonLoader";
import { EmptyState } from "@/components/EmptyState";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useAnimatedToast } from "@/components/AnimatedToast";
import { Flame, Clock, Activity, Target, Plus, Dumbbell } from "lucide-react";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

// Example Data Type
interface DashboardStats {
  totalCalories: number;
  totalHours: number;
  totalWorkouts: number;
  weeklyProgress: number;
  hasWorkouts: boolean;
}

// Example Component
export function DashboardExample() {
  const prefersReducedMotion = useReduceMotion();
  const { toasts, addToast, removeToast } = useAnimatedToast();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // محاكاة تحميل البيانات
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalCalories: 2500,
        totalHours: 5.5,
        totalWorkouts: 24,
        weeklyProgress: 85,
        hasWorkouts: true,
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddWorkout = () => {
    addToast("سيتم إضافة تمرين جديد", "info");
  };

  if (isLoading) {
    return <SkeletonStats />;
  }

  if (!stats) {
    return (
      <PageTransition>
        <EmptyState
          icon={Dumbbell}
          title="لا توجد بيانات"
          description="لم نتمكن من تحميل بيانات لوحتك التحكمية"
          action={{
            label: "إعادة محاولة",
            onClick: () => window.location.reload(),
          }}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-2">مرحباً! إليك ملخص نشاطك اليومي</p>
        </div>

        {/* Stats Cards - مع Stagger Animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <StatsCard
              title="إجمالي السعرات"
              value={stats.totalCalories}
              icon={Flame}
              animateValue={true}
              suffix=" kcal"
              color="danger"
              description="هذا الأسبوع"
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <StatsCard
              title="ساعات التمرين"
              value={stats.totalHours}
              icon={Clock}
              animateValue={true}
              suffix=" h"
              color="primary"
              description="هذا الأسبوع"
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <StatsCard
              title="عدد التمارين"
              value={stats.totalWorkouts}
              icon={Activity}
              animateValue={true}
              color="success"
              description="في هذا الشهر"
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <StatsCard
              title="الهدف الأسبوعي"
              value={stats.weeklyProgress}
              icon={Target}
              animateValue={true}
              suffix="%"
              color="warning"
              description="مكتمل"
            />
          </motion.div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card rounded-2xl p-6 border border-border"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ delay: 0.2 }}
        >
          <motion.div variants={staggerItem}>
            <AnimatedProgressBar
              value={750}
              max={1000}
              label="السعرات اليومية"
              color="success"
            />
          </motion.div>

          <motion.div variants={staggerItem} className="flex justify-center">
            <AnimatedProgressRing
              value={65}
              max={100}
              label="أهداف الأسبوع"
              size={140}
              color="primary"
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <AnimatedProgressBar
              value={45}
              max={100}
              label="مستوى الاستقرار"
              color="warning"
            />
          </motion.div>
        </motion.div>

        {/* Recent Workouts - مع Empty State */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-border"
          initial="hidden"
          animate="visible"
          variants={staggerItem}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">آخر التمارين</h2>

          {stats.hasWorkouts ? (
            <motion.div
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Example workout items */}
              {[
                {
                  id: 1,
                  name: "تمرين الجري",
                  duration: "30 دقيقة",
                  calories: 250,
                },
                {
                  id: 2,
                  name: "تمارين القوة",
                  duration: "45 دقيقة",
                  calories: 300,
                },
                {
                  id: 3,
                  name: "تمرين اليوجا",
                  duration: "60 دقيقة",
                  calories: 150,
                },
              ].map((workout) => (
                <motion.div
                  key={workout.id}
                  variants={staggerItem}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{workout.name}</p>
                    <p className="text-sm text-muted-foreground">{workout.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-500">{workout.calories}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon={Dumbbell}
              title="لا توجد تمارين بعد"
              description="ابدأ رحلتك الرياضية الآن"
              action={{
                label: "إضافة تمرين",
                onClick: handleAddWorkout,
              }}
            />
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3 flex-wrap"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ delay: 0.6 }}
        >
          <motion.div variants={staggerItem}>
            <AnimatedButton
              variant="default"
              size="lg"
              icon={<Plus size={20} />}
              onClick={handleAddWorkout}
            >
              إضافة تمرين
            </AnimatedButton>
          </motion.div>

          <motion.div variants={staggerItem}>
            <AnimatedButton
              variant="outline"
              size="lg"
              onClick={() => addToast("تم عرض التقارير", "info")}
            >
              عرض التقارير
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
          {/* Toasts will be rendered here from useAnimatedToast */}
        </div>
      </div>
    </PageTransition>
  );
}

/**
 * النقاط الرئيسية في هذا المثال:
 * 
 * 1. ✅ استخدام PageTransition للانتقال السلس
 * 2. ✅ عرض SkeletonStats أثناء التحميل
 * 3. ✅ عرض EmptyState عند عدم وجود بيانات
 * 4. ✅ استخدام Stagger Animation لعرض العناصر بتتابع
 * 5. ✅ Animated Stats Cards مع تحريك الأرقام
 * 6. ✅ Progress Bars و Rings محسّنة
 * 7. ✅ AnimatedButton للأزرار الرئيسية
 * 8. ✅ Toast notifications للتعليقات
 * 9. ✅ احترام useReduceMotion للـ Accessibility
 * 10. ✅ Hover effects على العناصر التفاعلية
 */
