#!/bin/bash

# 🧪 FitMaster UX + Animations - Test Script
# اختبر جميع الملفات والـ imports

echo "🎨 اختبار FitMaster UX + Animations"
echo "===================================="

cd "$(dirname "$0")" || exit 1

# 1. التحقق من وجود الملفات الأساسية
echo ""
echo "1️⃣  التحقق من الملفات الأساسية..."
required_files=(
  "client/src/lib/animations.ts"
  "client/src/hooks/use-animated-number.tsx"
  "client/src/hooks/use-reduce-motion.tsx"
  "client/src/components/EmptyState.tsx"
  "client/src/components/SkeletonLoader.tsx"
  "client/src/components/AnimatedToast.tsx"
  "client/src/components/PageTransition.tsx"
  "client/src/components/AnimatedProgress.tsx"
  "client/src/components/StatsCard.tsx"
  "client/src/components/index.ts"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - غير موجود!"
  fi
done

# 2. التحقق من التثبيتات
echo ""
echo "2️⃣  التحقق من المكتبات المثبتة..."
npm list framer-motion > /dev/null 2>&1 && echo "✅ framer-motion" || echo "❌ framer-motion"
npm list react > /dev/null 2>&1 && echo "✅ react" || echo "❌ react"
npm list typescript > /dev/null 2>&1 && echo "✅ typescript" || echo "❌ typescript"

# 3. اختبار TypeScript
echo ""
echo "3️⃣  اختبار TypeScript للملفات الرئيسية..."
npx tsc --noEmit client/src/lib/animations.ts 2>&1 | grep -q "error" && echo "❌ animations.ts لديها أخطاء" || echo "✅ animations.ts"
npx tsc --noEmit client/src/hooks/use-animated-number.tsx 2>&1 | grep -q "error" && echo "❌ use-animated-number.tsx لديها أخطاء" || echo "✅ use-animated-number.tsx"
npx tsc --noEmit client/src/hooks/use-reduce-motion.tsx 2>&1 | grep -q "error" && echo "❌ use-reduce-motion.tsx لديها أخطاء" || echo "✅ use-reduce-motion.tsx"

# 4. التحقق من ملفات التوثيق
echo ""
echo "4️⃣  التحقق من ملفات التوثيق..."
doc_files=(
  "UX_ANIMATIONS_GUIDE.md"
  "QUICK_REFERENCE.md"
  "README_UX_ANIMATIONS.md"
  "EXAMPLE_DASHBOARD.tsx"
)

for file in "${doc_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - غير موجود!"
  fi
done

# 5. عد الأسطر في الملفات
echo ""
echo "5️⃣  إحصائيات الكود..."
echo "📊 عدد أسطر في animations.ts: $(wc -l < client/src/lib/animations.ts)"
echo "📊 عدد أسطر في components/index.ts: $(wc -l < client/src/components/index.ts)"
echo "📊 عدد أسطر في UX_ANIMATIONS_GUIDE.md: $(wc -l < UX_ANIMATIONS_GUIDE.md)"

# 6. ملخص
echo ""
echo "===================================="
echo "✅ اختبار مكتمل!"
echo ""
echo "📚 للبدء:"
echo "   1. اقرأ: UX_ANIMATIONS_GUIDE.md"
echo "   2. استخدم: QUICK_REFERENCE.md"
echo "   3. ادرس: EXAMPLE_DASHBOARD.tsx"
echo ""
echo "🚀 لتشغيل التطبيق:"
echo "   npm run dev"
echo ""
