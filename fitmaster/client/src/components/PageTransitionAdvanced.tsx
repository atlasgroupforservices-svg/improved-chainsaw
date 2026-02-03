// 🎬 PageTransition.tsx - مكون الانتقال بين الصفحات

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReduceMotion } from '@/hooks/use-reduce-motion';

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 Types Definition
// ═══════════════════════════════════════════════════════════════════════════

export type TransitionType = 
  | 'fade' 
  | 'slide' 
  | 'scale' 
  | 'sharedElement' 
  | 'fadeSlide';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export interface PageTransitionConfig {
  type: TransitionType;
  direction?: SlideDirection;
  duration?: number;
  isReverse?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 Transition Variants
// ═══════════════════════════════════════════════════════════════════════════

const getTransitionVariants = (config: PageTransitionConfig) => {
  const { type, direction = 'left', isReverse = false } = config;
  const duration = config.duration || 0.3;

  // Slide directions
  const slideDistance = 100;
  let slideX = slideDistance;
  let slideY = 0;

  if (direction === 'right') slideX = -slideDistance;
  if (direction === 'up') {
    slideX = 0;
    slideY = slideDistance;
  }
  if (direction === 'down') {
    slideX = 0;
    slideY = -slideDistance;
  }

  // Reverse for back navigation
  if (isReverse) {
    slideX = -slideX;
    slideY = -slideY;
  }

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: slideX, y: slideY },
      animate: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, x: -slideX, y: -slideY },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    sharedElement: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    fadeSlide: {
      initial: { 
        opacity: 0, 
        y: slideY === 0 ? slideX / 20 : slideY / 20 
      },
      animate: { opacity: 1, y: 0 },
      exit: { 
        opacity: 0, 
        y: -(slideY === 0 ? slideX / 20 : slideY / 20) 
      },
    },
  };

  return {
    ...variants[type],
    transition: {
      duration,
      ease: type === 'scale' ? 'easeOut' : 'easeOut',
    },
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎬 Main PageTransition Component
// ═══════════════════════════════════════════════════════════════════════════

export function PageTransition({
  children,
  config,
  isVisible = true,
}: {
  children: ReactNode;
  config: PageTransitionConfig;
  isVisible?: boolean;
}) {
  const prefersReducedMotion = useReduceMotion();
  const variants = getTransitionVariants(config);

  // اذا الـ user يفضل reduced motion، بدون animation
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={variants.initial}
      animate={isVisible ? variants.animate : variants.initial}
      exit={variants.exit}
      transition={variants.transition}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎬 Predefined Transitions (Ready to Use)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dashboard ➜ Any Page
 * استخدم: Fade (محترف وآمن)
 */
export function FadeTransition({
  children,
  isVisible = true,
}: {
  children: ReactNode;
  isVisible?: boolean;
}) {
  return (
    <PageTransition
      config={{ type: 'fade', duration: 0.25 }}
      isVisible={isVisible}
    >
      {children}
    </PageTransition>
  );
}

/**
 * Forward Navigation (هدف جديد)
 * Dashboard ➜ Workouts
 * استخدم: Slide Left (بديهي + واضح)
 */
export function SlideLeftTransition({
  children,
  isVisible = true,
  duration = 0.3,
}: {
  children: ReactNode;
  isVisible?: boolean;
  duration?: number;
}) {
  return (
    <PageTransition
      config={{ type: 'slide', direction: 'left', duration }}
      isVisible={isVisible}
    >
      {children}
    </PageTransition>
  );
}

/**
 * Back Navigation (رجوع)
 * Detail ➜ List
 * استخدم: Slide Right (معكوس)
 */
export function SlideRightTransition({
  children,
  isVisible = true,
  duration = 0.3,
}: {
  children: ReactNode;
  isVisible?: boolean;
  duration?: number;
}) {
  return (
    <PageTransition
      config={{ type: 'slide', direction: 'right', duration, isReverse: true }}
      isVisible={isVisible}
    >
      {children}
    </PageTransition>
  );
}

/**
 * Drill Down (تفاصيل)
 * Card ➜ Detail Page
 * استخدم: Scale (Wow Effect)
 */
export function ScaleTransition({
  children,
  isVisible = true,
}: {
  children: ReactNode;
  isVisible?: boolean;
}) {
  return (
    <PageTransition
      config={{ type: 'scale', duration: 0.25 }}
      isVisible={isVisible}
    >
      {children}
    </PageTransition>
  );
}

/**
 * Lateral Navigation (نفس المستوى)
 * Calories ➜ Progress (Tab Switch)
 * استخدم: Fade + Slide (Modern)
 */
export function FadeSlideTransition({
  children,
  isVisible = true,
  direction = 'up',
}: {
  children: ReactNode;
  isVisible?: boolean;
  direction?: SlideDirection;
}) {
  return (
    <PageTransition
      config={{ type: 'fadeSlide', direction, duration: 0.3 }}
      isVisible={isVisible}
    >
      {children}
    </PageTransition>
  );
}

/**
 * Smart Transition (اختيار تلقائي)
 * يختار الـ transition المناسب حسب النوع
 */
export function SmartTransition({
  children,
  type = 'forward',
  isVisible = true,
}: {
  children: ReactNode;
  type?: 'forward' | 'back' | 'drillDown' | 'lateral' | 'fade';
  isVisible?: boolean;
}) {
  const transitions = {
    forward: <SlideLeftTransition isVisible={isVisible}>{children}</SlideLeftTransition>,
    back: <SlideRightTransition isVisible={isVisible}>{children}</SlideRightTransition>,
    drillDown: <ScaleTransition isVisible={isVisible}>{children}</ScaleTransition>,
    lateral: <FadeSlideTransition isVisible={isVisible}>{children}</FadeSlideTransition>,
    fade: <FadeTransition isVisible={isVisible}>{children}</FadeTransition>,
  };

  return transitions[type];
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧁 Staggered Page Transition (للـ Children)
// ═══════════════════════════════════════════════════════════════════════════

export function StaggeredPageTransition({
  children,
  config,
  staggerDelay = 0.05,
}: {
  children: React.ReactElement<any>[] | React.ReactElement;
  config: PageTransitionConfig;
  staggerDelay?: number;
}) {
  const prefersReducedMotion = useReduceMotion();
  const childArray = React.Children.toArray(children);

  if (prefersReducedMotion) {
    return <>{childArray}</>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {childArray.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧪 Demo Components
// ═══════════════════════════════════════════════════════════════════════════

/**
 * استخدام مثال في الـ Router:
 * 
 * import { SmartTransition } from "@/components/PageTransition";
 * 
 * // Forward Navigation
 * <SmartTransition type="forward">
 *   <Dashboard />
 * </SmartTransition>
 * 
 * // Back Navigation
 * <SmartTransition type="back">
 *   <Workouts />
 * </SmartTransition>
 * 
 * // Drill Down to Details
 * <SmartTransition type="drillDown">
 *   <WorkoutDetail />
 * </SmartTransition>
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📊 Default Export
// ═══════════════════════════════════════════════════════════════════════════

export default PageTransition;
