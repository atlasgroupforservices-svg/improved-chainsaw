// 🎯 Implementation Guide - تطبيق Insight Cards + Page Transitions

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Imports
import {
  InsightCard,
  PerformanceInsight,
  GoalProgressInsight,
  WarningInsight,
  ConsistencyInsight,
  BalanceInsight,
  RestInsight,
  InsightCardContainer,
} from '@/components/InsightCard';

import {
  PageTransition,
  SmartTransition,
  SlideLeftTransition,
  FadeTransition,
  ScaleTransition,
} from '@/components/PageTransitionAdvanced';

// ═══════════════════════════════════════════════════════════════════════════
// 📊 DASHBOARD PAGE - مع Insights
// ═══════════════════════════════════════════════════════════════════════════

export function DashboardWithInsights() {
  const [insights, setInsights] = useState<any[]>([]);

  // 🧠 Logic لـ Generate Insights
  const generateInsights = (data: any) => {
    const generatedInsights = [];

    // 1. Performance Insight
    if (data.weeklyProgress > 70) {
      generatedInsights.push({
        type: 'performance',
        trigger: 'Good Performance',
        title: '🏆 أداء متميز',
        message: `أداؤك هذا الأسبوع أفضل من ${data.historicalPercentile}% من أسابيعك السابقة`,
        icon: '🏆',
        color: 'green',
        tone: 'celebratory',
        animation: 'slideUp',
        priority: 1,
      });
    }

    // 2. Goal Progress Insight
    if (data.weeklyProgress >= 80 && data.weeklyProgress < 100) {
      const remaining = Math.ceil(data.hoursToGo);
      generatedInsights.push({
        type: 'goal',
        trigger: 'Almost Goal',
        title: '🔥 قريب من الهدف!',
        message: `باقي ${remaining} ساعة لتحقيق هدف الأسبوع!`,
        icon: '🔥',
        color: 'orange',
        tone: 'encouraging',
        animation: 'slideUp',
        priority: 1,
      });
    }

    // 3. Goal Achieved
    if (data.weeklyProgress >= 100) {
      generatedInsights.push({
        type: 'goal',
        trigger: 'Goal Achieved',
        title: '🎉 تهانينا!',
        message: `حققت هدفك الأسبوعي! شغل رائع 👏`,
        icon: '🎉',
        color: 'green',
        tone: 'celebratory',
        animation: 'scale',
        priority: 1,
      });
    }

    // 4. Consistency Insight
    if (data.streakDays >= 3) {
      generatedInsights.push({
        type: 'consistency',
        trigger: `Streak: ${data.streakDays}`,
        title: '📅 سلسلة مستمرة!',
        message: `تمرنت ${data.streakDays} أيام متتالية. استمر بهاد الزخم!`,
        icon: '📅',
        color: 'blue',
        tone: 'supportive',
        animation: 'slideUp',
        priority: 2,
      });
    }

    // 5. Balance Insight
    if (Math.abs(data.caloriesDifference) > 200) {
      const isHigher = data.caloriesDifference > 0;
      generatedInsights.push({
        type: 'balance',
        trigger: 'Calorie Imbalance',
        title: '⚖️ توازن الطاقة',
        message: isHigher
          ? `السعرات الداخلة أعلى من المحروقة بـ ${data.caloriesDifference}`
          : `السعرات المحروقة أعلى من الداخلة بـ ${Math.abs(data.caloriesDifference)}`,
        icon: '⚖️',
        color: 'purple',
        tone: 'supportive',
        animation: 'slideUp',
        priority: 2,
      });
    }

    // 6. Rest Insight
    if (data.daysWithoutWorkout >= 5) {
      generatedInsights.push({
        type: 'rest',
        trigger: `Rest: ${data.daysWithoutWorkout}`,
        title: '🛌 وقت الحركة',
        message: `لم تسجل أي تمرين منذ ${data.daysWithoutWorkout} أيام. جسمك يحتاج حركة خفيفة 🤸`,
        icon: '🛌',
        color: 'blue',
        tone: 'supportive',
        animation: 'slideUp',
        priority: 3,
      });
    }

    return generatedInsights;
  };

  // Sample Data
  useEffect(() => {
    const sampleData = {
      weeklyProgress: 85,
      historicalPercentile: 72,
      hoursToGo: 0.8,
      streakDays: 4,
      caloriesDifference: 250,
      daysWithoutWorkout: 2,
    };

    setInsights(generateInsights(sampleData));
  }, []);

  return (
    <FadeTransition>
      <div className="space-y-6 p-6">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">مرحباً بعودتك 👋</p>
        </motion.div>

        {/* ===== Insights Section ===== */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-sm text-gray-400 mb-3">💡 رؤى ذكية</p>
            <InsightCardContainer insights={insights} maxDisplay={2} />
          </motion.div>
        )}

        {/* ===== Stats Cards ===== */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Training Hours */}
          <div className="p-6 bg-card rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">ساعات التدريب</p>
            <h3 className="text-3xl font-bold text-purple-400 mt-2">5.5h</h3>
            <p className="text-xs text-gray-500 mt-2">هذا الأسبوع</p>
          </div>

          {/* Weekly Goal */}
          <div className="p-6 bg-card rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">الهدف الأسبوعي</p>
            <div className="mt-3 space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-sm font-medium">85%</p>
            </div>
          </div>

          {/* Streak */}
          <div className="p-6 bg-card rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">السلسلة</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-bold text-orange-400">4</span>
              <span className="text-xl">🔥</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">أيام متتالية</p>
          </div>
        </motion.div>
      </div>
    </FadeTransition>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏋️ WORKOUTS PAGE - مع Transitions
// ═══════════════════════════════════════════════════════════════════════════

export function WorkoutsWithTransitions() {
  const workouts = [
    { id: 1, name: 'تمرين الصدر', duration: '45 دقيقة', calories: 250 },
    { id: 2, name: 'تمرين الظهر', duration: '50 دقيقة', calories: 280 },
    { id: 3, name: 'تمرين الأرجل', duration: '60 دقيقة', calories: 320 },
  ];

  const [selectedWorkout, setSelectedWorkout] = useState<typeof workouts[0] | null>(null);

  return (
    <SlideLeftTransition>
      <div className="space-y-4 p-6">
        {/* ===== Header ===== */}
        <motion.h1 className="text-2xl font-bold">
          التمارين
        </motion.h1>

        {/* ===== Workouts List ===== */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {workouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              onClick={() => setSelectedWorkout(workout)}
              className="p-4 bg-card rounded-lg border border-gray-700 cursor-pointer hover:border-purple-500 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(168, 85, 247, 0.2)' }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{workout.name}</p>
                  <p className="text-sm text-gray-400">{workout.duration}</p>
                </div>
                <motion.div whileHover={{ x: 5 }}>
                  <p className="font-bold text-purple-400">{workout.calories} سعرة</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SlideLeftTransition>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 DETAIL PAGE - مع Scale Transition
// ═══════════════════════════════════════════════════════════════════════════

export function DetailPageWithScale({ insightData }: { insightData: any }) {
  return (
    <ScaleTransition>
      <div className="space-y-6 p-6">
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold">تفاصيل الأداء</h1>
          <p className="text-gray-400">تحليل شامل لـ أسبوعك</p>
        </motion.div>

        {/* ===== Content ===== */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Stats */}
          <div className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-500/30">
            <h3 className="font-bold text-lg mb-4">📊 الإحصائيات</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>التقدم نحو الهدف:</span>
                <span className="font-bold text-purple-400">85%</span>
              </div>
              <div className="flex justify-between">
                <span>ساعات التدريب:</span>
                <span className="font-bold text-green-400">5.5h</span>
              </div>
              <div className="flex justify-between">
                <span>السعرات المحروقة:</span>
                <span className="font-bold text-orange-400">2,450</span>
              </div>
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="p-6 bg-card rounded-lg border border-gray-700 h-64 flex items-center justify-center">
            <p className="text-gray-400">📈 رسم بياني سيأتي هنا</p>
          </div>
        </motion.div>
      </div>
    </ScaleTransition>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 Usage Example - في الـ App Router
// ═══════════════════════════════════════════════════════════════════════════

/**
 * استخدام مثال:
 * 
 * import {
 *   DashboardWithInsights,
 *   WorkoutsWithTransitions,
 *   DetailPageWithScale
 * } from '@/components/ImplementationGuide';
 * 
 * function App() {
 *   const [currentPage, setCurrentPage] = useState('dashboard');
 *   const [pageKey, setPageKey] = useState(0);
 * 
 *   const navigateTo = (page: string) => {
 *     setCurrentPage(page);
 *     setPageKey(prev => prev + 1);
 *   };
 * 
 *   return (
 *     <div>
 *       <AnimatePresence mode="wait">
 *         {currentPage === 'dashboard' && (
 *           <DashboardWithInsights key={pageKey} />
 *         )}
 *         {currentPage === 'workouts' && (
 *           <WorkoutsWithTransitions key={pageKey} />
 *         )}
 *         {currentPage === 'detail' && (
 *           <DetailPageWithScale key={pageKey} insightData={{}} />
 *         )}
 *       </AnimatePresence>
 *     </div>
 *   );
 * }
 * 
 * export default App;
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📝 Notes
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 🧠 Insight Cards Logic:
 * 
 * 1. قراءة البيانات من الـ API
 * 2. تحليل البيانات (Performance, Progress, Consistency, etc.)
 * 3. اختيار الأنسب (Priority system)
 * 4. عرض 1-2 فقط في الـ Dashboard
 * 5. إعادة التحقق كل ساعة أو عند تحديث البيانات
 * 
 * 🎬 Page Transitions Logic:
 * 
 * 1. Dashboard ➜ Any = Fade (آمن)
 * 2. Forward Nav = Slide Left (واضح)
 * 3. Back Nav = Slide Right (معكوس)
 * 4. Drill Down = Scale (Wow)
 * 5. Lateral = Fade + Slide (Modern)
 */

export default DashboardWithInsights;
