# 🚀 Quick Reference - استخدام سريع

## Copy/Paste Ready Examples

### 1️⃣ صفحة مع Page Transition + Empty State

```tsx
import { PageTransition } from "@/components/PageTransition";
import { EmptyState } from "@/components/EmptyState";
import { AnimatedButton } from "@/components/AnimatedButton";
import { Plus, Dumbbell } from "lucide-react";

export function MyPage() {
  const { data, isLoading } = useMyData();

  if (isLoading) return <SkeletonCard />;

  return (
    <PageTransition>
      <h1 className="text-3xl font-bold mb-6">عنوان الصفحة</h1>
      
      {data.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="لا توجد بيانات"
          description="ابدأ الآن بإضافة عنصر جديد"
          action={{
            label: "إضافة",
            onClick: () => navigate("/add")
          }}
        />
      ) : (
        <div className="grid gap-4">
          {data.map(item => (
            <Card key={item.id} {...item} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
```

---

### 2️⃣ Stats Dashboard

```tsx
import { StatsCard } from "@/components/StatsCard";
import { Flame, Clock, Activity, Target } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatsCard
    title="السعرات"
    value={2500}
    icon={Flame}
    animateValue={true}
    suffix=" kcal"
    color="danger"
  />
  
  <StatsCard
    title="ساعات التمرين"
    value={5.5}
    icon={Clock}
    animateValue={true}
    suffix=" h"
    color="primary"
  />
  
  <StatsCard
    title="عدد التمارين"
    value={24}
    icon={Activity}
    animateValue={true}
    color="success"
  />
  
  <StatsCard
    title="التقدم"
    value={85}
    icon={Target}
    animateValue={true}
    suffix="%"
    color="warning"
  />
</div>
```

---

### 3️⃣ Form مع Animated Inputs

```tsx
import { AnimatedInput } from "@/components/AnimatedInput";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useForm } from "react-hook-form";
import { Flame, Clock } from "lucide-react";

export function WorkoutForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AnimatedInput
        label="السعرات الحرارية"
        type="number"
        icon={<Flame size={18} />}
        error={errors.calories?.message}
        success={!errors.calories}
        {...register("calories")}
      />

      <AnimatedInput
        label="المدة (دقائق)"
        type="number"
        icon={<Clock size={18} />}
        error={errors.duration?.message}
        success={!errors.duration}
        {...register("duration")}
      />

      <AnimatedButton
        type="submit"
        loading={isSubmitting}
        variant="default"
        size="lg"
        className="w-full"
      >
        حفظ التمرين
      </AnimatedButton>
    </form>
  );
}
```

---

### 4️⃣ Progress Section

```tsx
import { AnimatedProgressBar, AnimatedProgressRing } from "@/components/AnimatedProgress";

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Progress Bar */}
  <div>
    <AnimatedProgressBar
      value={750}
      max={1000}
      label="السعرات اليومية"
      color="success"
    />
  </div>

  {/* Circular Progress */}
  <div className="flex justify-center">
    <AnimatedProgressRing
      value={65}
      max={100}
      label="أهداف الأسبوع"
      size={140}
      color="primary"
    />
  </div>

  {/* Simple Progress */}
  <div>
    <AnimatedProgressBar
      value={45}
      max={100}
      label="مستوى الاستقرار"
      color="warning"
    />
  </div>
</div>
```

---

### 5️⃣ Toast Notifications

```tsx
import { useAnimatedToast } from "@/components/AnimatedToast";

export function MyComponent() {
  const { success, error, warning, info, toasts, removeToast } = useAnimatedToast();

  const handleAction = async () => {
    try {
      await api.doSomething();
      success("تمت العملية بنجاح! 🎉");
    } catch (err) {
      error("حدث خطأ: " + err.message);
    }
  };

  return (
    <>
      <button onClick={handleAction}>
        اضغط هنا
      </button>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
```

---

### 6️⃣ List مع Stagger Animation

```tsx
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

<motion.div
  initial="hidden"
  animate="visible"
  variants={staggerContainer}
  className="space-y-4"
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={staggerItem}
      className="p-4 border rounded-lg"
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

### 7️⃣ Hover Effects

```tsx
import { motion } from "framer-motion";
import { cardHover, hoverScale } from "@/lib/animations";

{/* Card مع Hover */}
<motion.div
  whileHover={cardHover.whileHover}
  className="p-6 rounded-lg border"
>
  محتوى
</motion.div>

{/* عنصر مع Scale Hover */}
<motion.div
  whileHover={hoverScale.whileHover}
  whileTap={hoverScale.whileTap}
  className="cursor-pointer"
>
  انقر هنا
</motion.div>
```

---

## 🎨 Color System

استخدم في `color` prop:

| اللون | الاستخدام |
|------|---------|
| `primary` | الأساسي (أزرق) |
| `success` | نجاح (أخضر) |
| `warning` | تحذير (أصفر) |
| `danger` | خطر (أحمر) |

---

## ⚙️ Customization

### تغيير سرعة الحركات

```tsx
// في animations.ts
export const fadeIn: Variants = {
  // غيّر duration من 0.5 إلى 0.3 للأسرع
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }, // ← هنا
  },
};
```

### تعطيل الحركات للتطوير

```tsx
// في استخدام أي مكون
const prefersReducedMotion = useReduceMotion();

// القيمة ستكون true تلقائياً إذا كان نظام المستخدم معيّن
```

---

## 📊 Performance Tips

1. **استخدم `keys` في القوائم**
```tsx
{items.map(item => (
  <motion.div key={item.id}> {/* ضروري جداً */}
    {item}
  </motion.div>
))}
```

2. **استخدم `will-change` CSS**
```tsx
<motion.div className="will-change-transform">
  سيتم تحريك هذا العنصر
</motion.div>
```

3. **تجنب تحريك الـ layout**
```tsx
// ✅ صحيح - فقط opacity و transform
animate={{ opacity: 1, x: 100 }}

// ❌ خطأ - يؤثر على layout
animate={{ width: 100 }}
```

---

## 🧪 اختبار الحركات

```tsx
// في واجهة اختبار الحركات
describe("Animations", () => {
  it("should animate stats card on mount", () => {
    const { getByText } = render(<StatsCard value={100} />);
    expect(getByText("100")).toBeInTheDocument();
  });
});
```

---

## 🐛 استكشاف الأخطاء

### الحركات لا تعمل
- تأكد من تثبيت Framer Motion
- تحقق من أن المكون مُغلّف في `motion` div
- تأكد من صحة variants

### الحركات بطيئة جداً
- اختبر مع `will-change` CSS
- تقلل عدد الحركات المتزامنة
- استخدم `opacity` و `transform` فقط

### Accessibility Issues
- استخدم `useReduceMotion` hook
- اختبر مع قارئ الشاشة
- تأكد من أن النصوص قابلة للقراءة أثناء الحركة

---

## 🎯 Quick Links

- [دليل Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Components](https://www.radix-ui.com/)

---

**آخر تحديث:** يناير 2026
