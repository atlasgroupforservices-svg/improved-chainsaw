// 💡 InsightCard.tsx - مكون البطاقة الذكية الكامل
// نسخة متقدمة مع كل الأنواع الـ 6

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReduceMotion } from '@/hooks/use-reduce-motion';

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 Types Definition
// ═══════════════════════════════════════════════════════════════════════════

export type InsightType = 
  | 'performance' 
  | 'goal' 
  | 'warning' 
  | 'consistency' 
  | 'balance' 
  | 'rest';

export type ToneType = 
  | 'celebratory' 
  | 'encouraging' 
  | 'warning' 
  | 'playful' 
  | 'supportive';

export type ColorType = 'green' | 'orange' | 'yellow' | 'blue' | 'purple';

export interface InsightCardData {
  type: InsightType;
  trigger: string;           // ما حصل
  title: string;             // العنوان
  message: string;           // الرسالة
  icon: string;              // Emoji
  color: ColorType;
  tone: ToneType;
  cta?: {
    label: string;
    action: () => void;
  };
  animation?: 'fade' | 'slideUp' | 'scale';
  priority: 1 | 2 | 3;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 Configuration
// ═══════════════════════════════════════════════════════════════════════════

const COLOR_CONFIG: Record<ColorType, { bg: string; border: string; text: string }> = {
  green: {
    bg: 'from-emerald-900/30 to-green-900/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  },
  orange: {
    bg: 'from-orange-900/30 to-amber-900/20',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
  },
  yellow: {
    bg: 'from-yellow-900/30 to-amber-900/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
  },
  blue: {
    bg: 'from-blue-900/30 to-cyan-900/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
  purple: {
    bg: 'from-purple-900/30 to-violet-900/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
};

const TONE_EMOTES: Record<ToneType, string> = {
  celebratory: '🎉',
  encouraging: '💪',
  warning: '⚠️',
  playful: '😄',
  supportive: '🤝',
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 Main InsightCard Component
// ═══════════════════════════════════════════════════════════════════════════

export function InsightCard({ data }: { data: InsightCardData }) {
  const prefersReducedMotion = useReduceMotion();
  const [isHovered, setIsHovered] = useState(false);
  const colors = COLOR_CONFIG[data.color];

  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };

  const selectedAnimation = animationVariants[data.animation || 'slideUp'];

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-lg border
        bg-gradient-to-r ${colors.bg} ${colors.border}
        p-6 backdrop-blur-sm transition-all duration-300
        ${data.cta ? 'cursor-pointer' : ''}
        ${isHovered && data.cta ? 'border-opacity-60' : ''}
      `}
      onHoverStart={() => data.cta && setIsHovered(true)}
      onHoverEnd={() => data.cta && setIsHovered(false)}
      initial={!prefersReducedMotion ? selectedAnimation.initial : {}}
      animate={!prefersReducedMotion ? selectedAnimation.animate : {}}
      exit={!prefersReducedMotion ? selectedAnimation.exit : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={data.cta?.action}
    >
      {/* ===== Background Glow Effect ===== */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 blur rounded-lg"
          animate={isHovered ? { opacity: 0.1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* ===== Content ===== */}
      <div className="relative flex gap-4">
        {/* Icon */}
        <motion.div
          className="flex-shrink-0 text-4xl"
          animate={
            !prefersReducedMotion && isHovered && data.cta
              ? { scale: 1.1 }
              : { scale: 1 }
          }
          transition={{ duration: 0.2 }}
        >
          {data.icon}
        </motion.div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <motion.h3
            className={`text-lg font-bold ${colors.text} mb-1 truncate`}
            animate={
              !prefersReducedMotion && isHovered && data.cta
                ? { x: 4 }
                : { x: 0 }
            }
            transition={{ duration: 0.2 }}
          >
            {data.title}
          </motion.h3>

          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
            {data.message}
          </p>

          {/* CTA Button (if present) */}
          {data.cta && (
            <motion.button
              className="mt-3 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {data.cta.label}
              <span>→</span>
            </motion.button>
          )}
        </div>

        {/* Priority Badge */}
        <div className="flex-shrink-0">
          <motion.div
            className={`
              w-2 h-2 rounded-full
              ${
                data.priority === 1
                  ? 'bg-red-500'
                  : data.priority === 2
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
              }
            `}
            animate={
              !prefersReducedMotion && data.priority === 1
                ? { opacity: [0.5, 1, 0.5] }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 Performance Insight (الأداء)
// ═══════════════════════════════════════════════════════════════════════════

export function PerformanceInsight({
  weeklyProgress,
  historicalPercentile,
  onViewDetails,
}: {
  weeklyProgress: number;
  historicalPercentile: number;
  onViewDetails?: () => void;
}) {
  const data: InsightCardData = {
    type: 'performance',
    trigger: `Performance: ${weeklyProgress}%`,
    title: '🏆 أداء متميز',
    message: `أداؤك هذا الأسبوع أفضل من ${historicalPercentile}% من أسابيعك السابقة`,
    icon: '🏆',
    color: 'green',
    tone: 'celebratory',
    animation: 'slideUp',
    priority: 1,
    cta: onViewDetails
      ? { label: 'عرض التفاصيل', action: onViewDetails }
      : undefined,
  };

  return <InsightCard data={data} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔥 Goal Progress Insight (التقدم نحو الهدف)
// ═══════════════════════════════════════════════════════════════════════════

export function GoalProgressInsight({
  remainingTime,
  targetHours,
  currentHours,
  onPushHarder,
}: {
  remainingTime: string;
  targetHours: number;
  currentHours: number;
  onPushHarder?: () => void;
}) {
  const percentageToGo = Math.ceil(
    ((targetHours - currentHours) / targetHours) * 100
  );

  const data: InsightCardData = {
    type: 'goal',
    trigger: `Goal Progress: ${currentHours}/${targetHours}h`,
    title: '🔥 قريب من الهدف!',
    message: `باقي ${remainingTime} لتحقيق هدف الأسبوع (${percentageToGo}% للذهاب)`,
    icon: '🔥',
    color: 'orange',
    tone: 'encouraging',
    animation: 'slideUp',
    priority: 1,
    cta: onPushHarder
      ? { label: 'أضف تمرين', action: onPushHarder }
      : undefined,
  };

  return <InsightCard data={data} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚠️ Warning / Reality Check (التنبيه الذكي)
// ═══════════════════════════════════════════════════════════════════════════

export function WarningInsight({
  issue,
  suggestion,
  onReview,
}: {
  issue: string;
  suggestion: string;
  onReview?: () => void;
}) {
  const data: InsightCardData = {
    type: 'warning',
    trigger: `Warning: ${issue}`,
    title: '🦸‍♂️ وقفة تفتيش ذكية',
    message: `${suggestion} تحقق من البيانات 😄`,
    icon: '🦸‍♂️',
    color: 'yellow',
    tone: 'playful',
    animation: 'slideUp',
    priority: 2,
    cta: onReview ? { label: 'راجع البيانات', action: onReview } : undefined,
  };

  return <InsightCard data={data} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📅 Consistency Insight (الاستمرارية)
// ═══════════════════════════════════════════════════════════════════════════

export function ConsistencyInsight({
  streakDays,
  onKeepGoing,
}: {
  streakDays: number;
  onKeepGoing?: () => void;
}) {
  const motivationalMessage =
    streakDays < 3
      ? `أنت بتبني عادة جديدة! استمر بهاد الزخم`
      : streakDays < 7
      ? `أسبوع تقريباً! نقص شوية أيام`
      : `أسبوع أو أكثر! أنت في منطقة الخطر (بالإيجاب!)`;

  const data: InsightCardData = {
    type: 'consistency',
    trigger: `Streak: ${streakDays} days`,
    title: '📅 سلسلة مستمرة!',
    message: `تمرنت ${streakDays} أيام متتالية. ${motivationalMessage}`,
    icon: '📅',
    color: 'blue',
    tone: 'supportive',
    animation: 'slideUp',
    priority: 2,
    cta: onKeepGoing
      ? { label: 'أضف تمرين آخر', action: onKeepGoing }
      : undefined,
  };

  return <InsightCard data={data} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// ⚖️ Health Balance Insight (التوازن)
// ═══════════════════════════════════════════════════════════════════════════

export function BalanceInsight({
  caloriesDifference,
  percentage,
  onAdjust,
}: {
  caloriesDifference: number;
  percentage: number;
  onAdjust?: () => void;
}) {
  const isHigher = caloriesDifference > 0;
  const message = isHigher
    ? `السعرات الداخلة أعلى من المحروقة بـ ${percentage}%`
    : `السعرات المحروقة أعلى من الداخلة بـ ${Math.abs(percentage)}%`;

  const data: InsightCardData = {
    type: 'balance',
    trigger: `Balance: ${isHigher ? 'surplus' : 'deficit'} ${percentage}%`,
    title: '⚖️ توازن الطاقة',
    message,
    icon: '⚖️',
    color: 'purple',
    tone: 'supportive',
    animation: 'slideUp',
    priority: 2,
    cta: onAdjust ? { label: 'عدّل الخطة', action: onAdjust } : undefined,
  };

  return <InsightCard data={data} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛌 Rest & Recovery Insight (الراحة)
// ═══════════════════════════════════════════════════════════════════════════

export function RestInsight({
  restDays,
  onScheduleLight,
}: {
  restDays: number;
  onScheduleLight?: () => void;
}) {
  const recommendation =
    restDays > 7 ? 'جسمك يحتاج حركة خفيفة' : 'يوم راحة مستحقة';

  const data: InsightCardData = {
    type: 'rest',
    trigger: `Rest: ${restDays} days`,
    title: '🛌 وقت الراحة',
    message: `لم تسجل أي تمرين منذ ${restDays} أيام. ${recommendation} 🤸`,
    icon: '🛌',
    color: 'blue',
    tone: 'supportive',
    animation: 'slideUp',
    priority: 3,
    cta: onScheduleLight
      ? { label: 'جدول تمرين خفيف', action: onScheduleLight }
      : undefined,
  };

  return <InsightCard data={data} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎪 InsightCardContainer - عرض Insights متعددة
// ═══════════════════════════════════════════════════════════════════════════

export function InsightCardContainer({
  insights,
  maxDisplay = 2,
}: {
  insights: InsightCardData[];
  maxDisplay?: number;
}) {
  const prefersReducedMotion = useReduceMotion();

  // ترتيب حسب Priority ثم الأهم أولاً
  const sortedInsights = [...insights]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxDisplay);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {sortedInsights.map((insight, index) => (
          <motion.div
            key={`${insight.type}-${insight.trigger}`}
            initial={
              !prefersReducedMotion
                ? { opacity: 0, y: 20 }
                : {}
            }
            animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
            exit={!prefersReducedMotion ? { opacity: 0, y: -20 } : {}}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
          >
            <InsightCard data={insight} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 Default Exports
// ═══════════════════════════════════════════════════════════════════════════

export default InsightCard;
