# 🎯 Micro-Animations - Best Practices و Common Mistakes

## ✅ ما الصح

### 1. استخدم Transform و Opacity فقط

```tsx
// ✅ GOOD - سريع جداً، بلا jank
<motion.button
  whileHover={{ scale: 1.05, opacity: 0.9 }}
  transition={{ duration: 0.2 }}
>
  حفظ
</motion.button>
```

```tsx
// ❌ BAD - بطيء جداً، animation كتاع يتحرك
<motion.button
  whileHover={{
    width: "200px",           // ❌ Layout shift!
    padding: "20px 40px",     // ❌ Expensive!
    borderRadius: "20px"      // ❌ Re-paint!
  }}
>
  حفظ
</motion.button>
```

**لماذا؟**
- `transform` و `opacity` = GPU acceleration
- `width`, `padding`, `position` = CPU calculation (بطيء)

---

### 2. استخدم Duration قصيرة جداً

```tsx
// ✅ GOOD - سريعة وواضحة
<motion.button
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.15 }}  // 150ms
>
  حفظ
</motion.button>
```

```tsx
// ❌ BAD - بطيئة وممل
<motion.button
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 2 }}     // 2 seconds!! 😴
>
  حفظ
</motion.button>
```

**الـ Duration الصحيح:**
| الحالة | الوقت |
|------|-------|
| Hover (Desktop) | 150-200ms |
| Click/Tap | 100-150ms |
| Notification | 300ms |
| Progress | 600-800ms |
| Loading | 1-2s |

---

### 3. استخدم Easing الصحيح

```tsx
// ✅ GOOD - يحس بالطبيعة
<motion.div
  animate={{ scale: 1.02 }}
  transition={{
    duration: 0.2,
    ease: "easeOut"    // بتبطأ في الآخر
  }}
>
  الهدف
</motion.div>
```

```tsx
// ❌ BAD - يحس بـ robot
<motion.div
  animate={{ scale: 1.02 }}
  transition={{
    duration: 0.2,
    ease: "linear"     // سرعة واحدة ممل جداً
  }}
>
  الهدف
</motion.div>
```

**أفضل Easing:**
- `easeOut` → Enter animations
- `easeInOut` → Transitions
- `easeIn` → Exit animations
- Spring physics → Interactive elements

---

### 4. احترم prefers-reduced-motion

```tsx
// ✅ GOOD - يحترم المستخدم
const prefersReducedMotion = useReduceMotion();

<motion.button
  whileHover={
    !prefersReducedMotion ? { scale: 1.05 } : {}
  }
>
  حفظ
</motion.button>
```

```tsx
// ❌ BAD - إجبار animation حتى لو بغى المستخدم لا
<motion.button
  whileHover={{ scale: 1.05 }}  // دايماً بتجري
>
  حفظ
</motion.button>
```

**المستخدمين اللي بيختارو "Reduce Motion":**
- أشخاص مع vestibular disorders
- أشخاص مع photosensitivity
- أشخاص على جهاز بطيء

---

### 5. كل animation يخدم هدف

```tsx
// ✅ GOOD - الهدف واضح
<motion.button
  whileHover={{ scale: 1.05 }}    // ← "هذا قابل للنقر"
  whileTap={{ scale: 0.95 }}      // ← "تم القبول"
  transition={{ duration: 0.15 }}
>
  حفظ
</motion.button>
```

```tsx
// ❌ BAD - حركة بلا هدف (زينة فقط)
<motion.button
  animate={{
    rotate: [0, 360],             // ← لماذا دوّار؟
    scale: [1, 1.2, 1],          // ← لماذا كتبير بعدين صغير؟
    skew: [0, 10, -10, 0]        // ← لماذا كتتحرف؟
  }}
  transition={{ repeat: Infinity, duration: 3 }}
>
  حفظ
</motion.button>
```

---

## ❌ Common Mistakes (تجنبها!)

### Mistake #1: Animations Loop بلا نهاية

```tsx
// ❌ BAD - مزعج جداً!
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ repeat: Infinity, duration: 0.6 }}
  className="p-4 bg-card"
>
  تهانينا!
</motion.div>
```

```tsx
// ✅ GOOD - مرة واحدة بس
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 0.6 }}    // بدون repeat!
  className="p-4 bg-card"
>
  تهانينا!
</motion.div>
```

---

### Mistake #2: Stagger كثير على الـ Children

```tsx
// ❌ BAD - 500ms+ على كل عنصر = سلو جداً
const containerVariants = {
  container: {
    staggerChildren: 0.5  // 500ms بين كل عنصر!
  }
};

// 5 عناصر = 2500ms = مملّ جداً! 😴
```

```tsx
// ✅ GOOD - stagger قليل (50-100ms)
const containerVariants = {
  container: {
    staggerChildren: 0.05  // 50ms بين الواحد والثاني
  }
};

// 5 عناصر = 250ms = في الحين! ⚡
```

---

### Mistake #3: استخدام animate على render كل مرة

```tsx
// ❌ BAD - animation تجري كل مرة ما يكون rerender
function MyComponent({ data }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}  // ← تجري في كل render!
      transition={{ duration: 0.6 }}
    >
      {data}
    </motion.div>
  );
}
```

```tsx
// ✅ GOOD - animation تجري بس على specific trigger
function MyComponent({ data, shouldAnimate }) {
  return (
    <motion.div
      animate={
        shouldAnimate
          ? { scale: [1, 1.1, 1] }
          : {}
      }
      transition={{ duration: 0.6 }}
    >
      {data}
    </motion.div>
  );
}
```

---

### Mistake #4: Animations كتاع مختلفة بـ timing

```tsx
// ❌ BAD - كل واحد animation فيها مدة مختلفة (بيحس بـ chaotic)
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}  // 300ms
>
  Title
</motion.div>

<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}    // 1000ms (مختلف!)
>
  Subtitle
</motion.div>

<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}  // 800ms (مختلف!)
>
  Content
</motion.div>
```

```tsx
// ✅ GOOD - duration واحدة مع stagger قليل
const containerVariants = {
  container: {
    staggerChildren: 0.05
  },
  item: {
    opacity: 1
  }
};

<motion.div variants={containerVariants}>
  <motion.div variants={containerVariants.item}>
    Title
  </motion.div>
  <motion.div variants={containerVariants.item}>
    Subtitle
  </motion.div>
  <motion.div variants={containerVariants.item}>
    Content
  </motion.div>
</motion.div>
```

---

### Mistake #5: بدل Spring Physics في كل مكان

```tsx
// ❌ BAD - Spring يخليها bouncy (مشي دايماً حلو)
<motion.button
  whileHover={{ scale: 1.05 }}
  transition={{
    type: "spring",
    stiffness: 400,
    damping: 10
  }}  // ← Bouncy effect
>
  حفظ
</motion.button>
```

```tsx
// ✅ GOOD - Spring للـ Interactive animations بس
// Hover → easeOut
// Jump/Celebrate → spring

<motion.button
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
>
  حفظ
</motion.button>

{/* لكن Celebration → Spring يحس بـ joy */}
<motion.div
  animate={{ scale: [1, 1.2, 0.9, 1] }}
  transition={{ type: "spring", stiffness: 200 }}
>
  🎉
</motion.div>
```

---

### Mistake #6: لا تستخدم AnimatePresence بغير reason

```tsx
// ❌ BAD - AnimatePresence بدون animation؟
<AnimatePresence>
  {isVisible && (
    <div>محتوى</div>  // ← مافيش motion component!
  )}
</AnimatePresence>
```

```tsx
// ✅ GOOD - AnimatePresence مع exit animation
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}  // ← هاي اللي تحتاجها AnimatePresence
      transition={{ duration: 0.3 }}
    >
      محتوى
    </motion.div>
  )}
</AnimatePresence>
```

---

## 📊 Micro-Animations Performance Guide

### CPU vs GPU

| Property | GPU? | Performance | استخدم? |
|----------|------|-------------|---------|
| transform | ✅ | ⚡⚡⚡ | نعم |
| opacity | ✅ | ⚡⚡⚡ | نعم |
| width | ❌ | ⚠️ | لا! |
| height | ❌ | ⚠️ | لا! |
| padding | ❌ | ⚠️ | لا! |
| position | ❌ | ⚠️ | لا! |
| color | ❌ | ⚠️ | لا! |
| border | ❌ | ⚠️ | لا! |

---

## 🎨 Perfect Timings Reference

```tsx
// Desktop Interactions
const HOVER_DURATION = 0.15;    // 150ms
const CLICK_DURATION = 0.1;     // 100ms

// Mobile/Touch
const TAP_DURATION = 0.1;       // 100ms
const LONG_PRESS_DURATION = 0.2; // 200ms

// Feedback Animations
const TOAST_DURATION = 0.3;     // 300ms
const SHAKE_DURATION = 0.4;     // 400ms
const HIGHLIGHT_DURATION = 0.6; // 600ms

// Transitions
const PAGE_TRANSITION = 0.3;    // 300ms
const MODAL_DURATION = 0.3;     // 300ms

// Loading States
const SKELETON_PULSE = 2.0;     // 2 seconds (infinite)
const SPINNER_DURATION = 1.0;   // 1 second (infinite)

// Celebrations
const SUCCESS_CELEBRATION = 0.6; // 600ms
const CONFETTI_DURATION = 1.0;   // 1 second
```

---

## 🔧 Debugging Tips

### Problem: Animation feels laggy

```tsx
// ❌ First check: Are you animating GPU properties?
animate={{
  width: "100%",      // ← Probably the culprit
  height: "100%",     // ← Guilty!
  position: "relative" // ← Expensive!
}}

// ✅ Solution: Use transform instead
animate={{
  x: 0,              // transform translateX
  scale: 1           // transform scale
}}
```

### Problem: Animation jank on mobile

```tsx
// ❌ Too many staggered children
<motion.div
  variants={containerVariants}
  animate="container"
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={itemVariants}
      transition={{ staggerChildren: 0.2 }} // ← Too long!
    >
      {item}
    </motion.div>
  ))}
</motion.div>

// ✅ Reduce stagger on mobile
const staggerAmount = isMobile ? 0.02 : 0.05;
```

### Problem: Animation is too fast/slow

```tsx
// Test with actual users
// Quick reference:
// < 100ms  = Instant (feels too fast)
// 100-300ms = Good (Goldilocks zone)
// 300-600ms = Slower (use for progress)
// > 600ms  = Loading states
```

---

## 🚀 Checklist قبل اللي تطلع

- [ ] كل animation لها هدف واضح
- [ ] Duration بين 100-600ms (ما أطول من كيف)
- [ ] استخدام `transform` و `opacity` بس
- [ ] prefers-reduced-motion معروفة
- [ ] بدون Loops بلا سبب
- [ ] اختبر على الجوال
- [ ] Lighthouse score ما انقص
- [ ] 60fps عند الحد الأدنى
- [ ] تستخدم Spring بس للـ celebrations
- [ ] Documentation واضحة

---

## 📖 مراجع مفيدة

**Framer Motion Docs:**
```
https://www.framer.com/motion/
```

**Web Animation Performance:**
```
https://web.dev/animations-guide/
```

**Easing Functions:**
```
https://easings.net/
```

---

**تذكر: الهدف من Micro-Animations هو جعل التطبيق يحس بـ responsive و natural، مشي مزعج. إذا كان المستخدم ما بتاعها، شيل الحركة!** 🚀
