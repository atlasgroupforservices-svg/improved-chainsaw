# 🎨 FitMaster UX + Animations Guide

## 📋 جدول المحتويات
1. [الأدوات المثبتة](#الأدوات-المثبتة)
2. [Hooks المتاحة](#hooks-المتاحة)
3. [المكونات الرئيسية](#المكونات-الرئيسية)
4. [أمثلة الاستخدام](#أمثلة-الاستخدام)
5. [أفضل الممارسات](#أفضل-الممارسات)

---

## 🧰 الأدوات المثبتة

- **Framer Motion** - مكتبة الحركات الرئيسية
- **React Query** - إدارة الحالة والتخزين المؤقت
- **Tailwind CSS** - تنسيق CSS
- **Radix UI** - مكونات UI أساسية

---

## 🎯 Hooks المتاحة

### 1. `useAnimatedNumber`
تحريك الأرقام من قيمة إلى أخرى

```tsx
import { useAnimatedNumber, useCountUp } from "@/hooks/use-animated-number";

// استخدام أساسي
const displayValue = useCountUp({ 
  value: 250,
  duration: 0.8,
  suffix: " kcal",
  prefix: "إجمالي: "
});

// مع عشري
const distance = useDecimalCountUp({
  value: 12.5,
  decimals: 1,
  suffix: " km"
});
```

### 2. `useReduceMotion`
احترام تفضيل المستخدم لتقليل الحركات

```tsx
import { useReduceMotion } from "@/hooks/use-reduce-motion";

const prefersReducedMotion = useReduceMotion();

// استخدم في الشروط
{prefersReducedMotion ? (
  <div>سريع جداً</div>
) : (
  <motion.div animate={{ x: 100 }}>حركة سلسة</motion.div>
)}
```

---

## 🎬 المكونات الرئيسية

### 1. StatsCard (محسّن مع Number Animations)
```tsx
import { StatsCard } from "@/components/StatsCard";
import { Zap } from "lucide-react";

<StatsCard
  title="إجمالي التمارين"
  value={1250}
  icon={Zap}
  animateValue={true} // تفعيل تحريك الأرقام
  suffix=" kcal"
  color="success"
  description="هذا الأسبوع"
/>
```

**Props:**
- `animateValue` - تفعيل/تعطيل تحريك الأرقام
- `suffix` - نص بعد الرقم
- `prefix` - نص قبل الرقم
- `isLoading` - إظهار placeholder عند التحميل

---

### 2. EmptyState
```tsx
import { EmptyState } from "@/components/EmptyState";
import { Plus, Dumbbell } from "lucide-react";

<EmptyState
  icon={Dumbbell}
  title="لا توجد تمارين بعد"
  description="ابدأ رحلتك الرياضية اليوم وأضف أول تمرين"
  subtitle="سيتم حفظ جميع تمارينك هنا"
  action={{
    label: "إضافة تمرين",
    onClick: () => navigate("/add-workout")
  }}
/>
```

---

### 3. Progress Animations

#### Animated Progress Bar
```tsx
import { AnimatedProgressBar } from "@/components/AnimatedProgress";

<AnimatedProgressBar
  value={75}
  max={100}
  label="أهداف هذا الأسبوع"
  color="success"
  showPercentage={true}
/>
```

#### Circular Progress (Donut)
```tsx
import { AnimatedProgressRing } from "@/components/AnimatedProgress";

<AnimatedProgressRing
  value={65}
  max={100}
  label="السعرات"
  showPercentage={true}
  color="primary"
/>
```

---

### 4. Toast Notifications
```tsx
import { useAnimatedToast } from "@/components/AnimatedToast";

const { success, error, warning, info } = useAnimatedToast();

// استخدام
const handleAddWorkout = () => {
  try {
    // فعل شيء
    success("تمت إضافة التمرين بنجاح! 💪");
  } catch (err) {
    error("خطأ أثناء إضافة التمرين");
  }
};
```

---

### 5. Page Transitions
```tsx
import { PageTransition } from "@/components/PageTransition";

export function Dashboard() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* محتوى الصفحة */}
      </div>
    </PageTransition>
  );
}
```

---

### 6. Skeleton Loading
```tsx
import { SkeletonStats, SkeletonTable, SkeletonChart } from "@/components/SkeletonLoader";

// بدل:
{isLoading ? <SkeletonStats /> : <StatsCards />}
{isLoading ? <SkeletonTable rows={5} /> : <WorkoutTable />}
{isLoading ? <SkeletonChart /> : <ProgressChart />}
```

---

### 7. Micro-Interactions

#### Animated Button
```tsx
import { AnimatedButton } from "@/components/AnimatedButton";
import { Plus } from "lucide-react";

<AnimatedButton
  variant="default"
  size="lg"
  icon={<Plus size={20} />}
  loading={isSubmitting}
  onClick={handleAddWorkout}
>
  إضافة تمرين جديد
</AnimatedButton>
```

#### Animated Input
```tsx
import { AnimatedInput } from "@/components/AnimatedInput";

<AnimatedInput
  label="السعرات الحرارية"
  type="number"
  placeholder="أدخل العدد"
  error={errors.calories}
  success={!errors.calories && isDirty}
  icon={<Flame size={18} />}
  description="تقريبي من واقعك اليومي"
/>
```

---

## 📊 Animation Presets

من [lib/animations.ts](../lib/animations.ts):

```tsx
import { fadeIn, slideInFromRight, scaleIn, pulse, bounce, cardHover } from "@/lib/animations";
import { motion } from "framer-motion";

// Fade In
<motion.div initial="hidden" animate="visible" variants={fadeIn}>
  محتوى يظهر بتلاشي
</motion.div>

// Slide من اليمين (RTL friendly)
<motion.div variants={slideInFromRight}>
  محتوى ينزلق
</motion.div>

// Scale مع Fade
<motion.div variants={scaleIn}>
  محتوى يكبر ويظهر
</motion.div>

// Card Hover Effect
<motion.div whileHover={cardHover.whileHover}>
  بطاقة تتكبر عند الـ Hover
</motion.div>
```

---

## 💡 أمثلة الاستخدام

### مثال 1: صفحة التمارين محسّنة
```tsx
import { PageTransition } from "@/components/PageTransition";
import { EmptyState } from "@/components/EmptyState";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useWorkouts } from "@/hooks/use-workouts";

export function Workouts() {
  const { workouts, isLoading, error } = useWorkouts();

  if (isLoading) return <SkeletonTable />;
  if (error) return <ErrorState />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">تمارينك</h1>
        
        {workouts.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="لا توجد تمارين"
            description="ابدأ الآن بإضافة أول تمرين لك"
            action={{
              label: "إضافة تمرين",
              onClick: () => navigate("/add")
            }}
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid gap-4"
          >
            {workouts.map((workout) => (
              <motion.div key={workout.id} variants={staggerItem}>
                <WorkoutCard {...workout} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
```

### مثال 2: Dashboard مع Animated Stats
```tsx
import { StatsCard } from "@/components/StatsCard";
import { AnimatedProgressBar } from "@/components/AnimatedProgress";
import { useProfile } from "@/hooks/use-profile";

export function Dashboard() {
  const { stats, loading } = useProfile();

  return (
    <PageTransition>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي السعرات"
          value={stats.totalCalories}
          icon={Flame}
          animateValue={!loading}
          suffix=" kcal"
          color="success"
        />
        <StatsCard
          title="ساعات التمرين"
          value={stats.totalHours}
          icon={Clock}
          animateValue={!loading}
          suffix=" h"
          color="primary"
        />
      </div>

      <div className="mt-8 space-y-4">
        <AnimatedProgressBar
          value={stats.weeklyGoalProgress}
          label="تقدم الأسبوع"
        />
      </div>
    </PageTransition>
  );
}
```

---

## ✅ أفضل الممارسات

### 1. **احترم Reduce Motion**
```tsx
// ✅ صحيح
const prefersReducedMotion = useReduceMotion();
<motion.div
  animate={prefersReducedMotion ? {} : { x: 100 }}
>

// ❌ خطأ
<motion.div animate={{ x: 100 }}>
```

### 2. **لا تبالغ في الحركات**
```tsx
// ✅ حركات بسيطة وسريعة
duration: 0.3 - 0.8

// ❌ حركات طويلة ومزعجة
duration: 2 - 5
```

### 3. **استخدم `AnimatePresence` للـ Exit**
```tsx
// ✅ صحيح
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <motion.div key={item.id} exit={{ opacity: 0 }}>
      {item}
    </motion.div>
  ))}
</AnimatePresence>
```

### 4. **استخدم RTL friendly animations**
```tsx
// ✅ استخدم slideInFromRight / slideInFromLeft
// حسب الحاجة

// ❌ لا تحدد جهة ثابتة
```

### 5. **أضف Loading States**
```tsx
// ✅ دائماً أظهر Skeleton أثناء التحميل
{isLoading && <SkeletonCard />}
{!isLoading && <Card />}
```

---

## 🎯 Checklist للصفحات الجديدة

- [ ] أضف `PageTransition` wrapper
- [ ] استخدم `EmptyState` للحالات الفارغة
- [ ] أضف `Skeleton Loading` أثناء التحميل
- [ ] استخدم `AnimatedButton` للأزرار الرئيسية
- [ ] أضف `Toast` للتعليقات الناجحة/الخاطئة
- [ ] اختبر مع `prefers-reduced-motion`
- [ ] تأكد من Response في Hover/Focus

---

## 📱 Mobile Considerations

- الحركات أسرع وأخفف على الجوال
- تجنب `whileHover` على الجوال (استخدم `whileTap`)
- اختبر مع `prefers-reduced-motion`

---

## 🚀 الخطوات التالية

1. ✅ دمج الـ animations في الصفحات الموجودة
2. ✅ اختبار Accessibility مع Screen Readers
3. ✅ قياس الأداء (Performance)
4. ✅ استجمع تعليقات المستخدمين
