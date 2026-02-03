# 🚀 Micro-Animations - Quick Start Guide

**استنساخ وطبّق في 5 دقائق** ⏱️

---

## 🎯 Step 1: Copy-Paste Template

انسخ هذا الـ template على أي component:

```tsx
import { motion } from "framer-motion";
import { useReduceMotion } from "@/hooks/use-reduce-motion";

export function MyAnimatedComponent() {
  const prefersReducedMotion = useReduceMotion();

  return (
    <motion.div
      // Hover Effect
      whileHover={
        !prefersReducedMotion ? { scale: 1.02 } : {}
      }
      // Click Effect
      whileTap={
        !prefersReducedMotion ? { scale: 0.95 } : {}
      }
      // Timing
      transition={{ duration: 0.2 }}
      // Styling
      className="p-6 bg-card rounded-lg cursor-pointer"
    >
      Your Content
    </motion.div>
  );
}
```

---

## 🎯 Step 2: Most Common Animations (Copy-Paste Ready)

### 1. **Hover Scale + Shadow**

```tsx
<motion.div
  whileHover={!prefersReducedMotion ? {
    scale: 1.02,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  } : {}}
  transition={{ duration: 0.2 }}
>
  Card Content
</motion.div>
```

### 2. **Click/Tap Feedback**

```tsx
<motion.button
  whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
  transition={{ duration: 0.15 }}
>
  Click Me
</motion.button>
```

### 3. **Number Animation**

```tsx
const displayValue = useCountUp({
  value: 4.5,
  duration: 0.8,
  suffix: "h"
});

<h3>{displayValue}</h3>
```

### 4. **Progress Bar**

```tsx
<div className="h-2 bg-gray-200 rounded">
  <motion.div
    className="h-full bg-primary"
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.8 }}
  />
</div>
```

### 5. **Toast Notification**

```tsx
<motion.div
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -50 }}
  transition={{ duration: 0.3 }}
  className="p-4 bg-green-500 text-white rounded"
>
  ✅ Success!
</motion.div>
```

### 6. **Input Shake (Error)**

```tsx
<motion.input
  animate={isError ? {
    x: [-10, 10, -10, 10, 0]
  } : {}}
  transition={{ duration: 0.4 }}
  className={isError ? "border-red-500" : ""}
/>
```

### 7. **Icon Rotate (One Time)**

```tsx
<motion.span
  animate={{ rotate: [0, -10, 10, -10, 0] }}
  transition={{ duration: 0.6 }}
>
  🔥
</motion.span>
```

### 8. **Fade + Scale In**

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### 9. **Stagger Children**

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

## 🎯 Step 3: Apply to Your Pages

### Dashboard.tsx

```tsx
// في الـ stats cards
<motion.div
  whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
  className="p-6 bg-card rounded-lg"
>
  <p>Training Hours</p>
  <h3>{displayValue}h</h3>  {/* animated number */}
</motion.div>
```

### Workouts.tsx

```tsx
// في قائمة التمارين
{workouts.map((workout) => (
  <motion.div
    key={workout.id}
    whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
    className="p-4 border rounded"
  >
    {workout.name}
  </motion.div>
))}
```

### Calories.tsx

```tsx
// في form input
<motion.input
  type="number"
  animate={
    error ? { x: [-10, 10, -10, 10, 0] } : {}
  }
  transition={{ duration: 0.4 }}
/>
```

---

## ⏱️ Timing Cheat Sheet

```
Hover:        150ms  (easeOut)
Click/Tap:    100ms  (easeOut)
Notification: 300ms  (easeOut)
Shake:        400ms  (easeInOut)
Progress:     800ms  (easeInOut)
Celebration:  600ms  (spring)
```

---

## 🎨 Default Easing

```tsx
// Most animations
transition={{ duration: 0.2, ease: "easeOut" }}

// Drag/Smooth transitions
transition={{ duration: 0.3, ease: "easeInOut" }}

// Celebrations
transition={{ type: "spring", stiffness: 200 }}
```

---

## ❌ Don't Forget!

```tsx
// ✅ ALWAYS include this
const prefersReducedMotion = useReduceMotion();

// ✅ ALWAYS use transform/opacity
whileHover={{ scale: 1.02 }}  // ✅ Good
whileHover={{ width: "200px" }}  // ❌ Bad

// ✅ ALWAYS keep it short
transition={{ duration: 0.2 }}  // ✅ 200ms
transition={{ duration: 2 }}     // ❌ 2 seconds
```

---

## 🧪 Test Your Animation

```bash
# Run this to validate
npm run check
bash test-animations.sh
```

---

## 📱 Mobile Considerations

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

<motion.div
  whileHover={
    !isMobile && !prefersReducedMotion
      ? { scale: 1.02 }
      : {}
  }
/>
```

---

## 🎯 Super Quick Examples

### Card with everything

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={!prefersReducedMotion ? { 
    scale: 1.02, 
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)" 
  } : {}}
  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
  transition={{ duration: 0.2 }}
  className="p-6 bg-card rounded-lg border cursor-pointer"
>
  <p className="text-sm text-muted">Training</p>
  <h3 className="text-3xl font-bold">{value}h</h3>
</motion.div>
```

### Button with everything

```tsx
<motion.button
  whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
  transition={{ duration: 0.15 }}
  onClick={() => handleClick()}
  className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
>
  {loading ? "جارٍ..." : "حفظ"}
</motion.button>
```

---

## 🚀 Your Animation Checklist

- [ ] استورد `motion` من `framer-motion`
- [ ] استورد `useReduceMotion` من hooks
- [ ] استخدم `prefersReducedMotion` في كل animation
- [ ] استخدم `scale` و `opacity` و `x` و `y` فقط
- [ ] Duration: 100-300ms للأشياء الصغيرة
- [ ] Test on mobile
- [ ] Check performance (Lighthouse)

---

**That's it! You're ready! 🚀**

**Next Step:** اذهب إلى [MICRO_ANIMATIONS_IMPLEMENTATION.tsx](./MICRO_ANIMATIONS_IMPLEMENTATION.tsx)
