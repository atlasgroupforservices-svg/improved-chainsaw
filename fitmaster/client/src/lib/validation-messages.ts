export const validationMessages = {
  // التمارين
  workouts: {
    unrealisticReps: {
      condition: "reps >= 9999",
      ar: "هل أنت إنسان أم سوبرمان؟ هذا الرقم غير منطقي!",
      en: "Are you human or Superman? This number doesn't look realistic!",
    },
    largeSets: {
      condition: "sets >= 100",
      ar: "هذا ليس تمرينًا… هذا اختبار صبر خارق!",
      en: "This isn't a workout… it's a test of superhuman patience!",
    },
    veryLongDuration: {
      condition: "minutes >= 300", // 5 ساعات
      ar: "خمس ساعات تدريب؟ يبدو أنك تعيش في صالة الرياضة!",
      en: "Five hours of training? Looks like you live at the gym!",
    },
    invalidInput: {
      ar: "تأكد من الرقم، التطبيق لا يريد إحراجك!",
      en: "Double-check the number, the app doesn't want to embarrass you!",
    },
  },

  // السعرات الحرارية
  calories: {
    veryHighBurn: {
      condition: "caloriesOut >= 10000",
      ar: "هل شاركت في سباق ماراثون أم هربت من خطر ما؟",
      en: "Did you run a marathon or escape from danger?",
    },
    massiveIntake: {
      condition: "caloriesIn >= 10000",
      ar: "هذه كمية سعرات كافية لإطعام فريق كامل!",
      en: "That's enough calories to feed an entire team!",
    },
    negativeCalories: {
      ar: "السعرات لا تستطيع أن تكون سالبة!",
      en: "Calories can't be negative!",
    },
  },

  // المهارات
  skills: {
    handstandTooLong: {
      condition: "handstandSeconds >= 600", // 10 دقائق
      ar: "عشر دقائق مقلوبًا؟ الجاذبية لم تعد تؤثر عليك!",
      en: "Ten minutes upside down? Gravity no longer affects you!",
    },
    pullupsTooHigh: {
      condition: "pullups >= 1000",
      ar: "تستطيع الطيران؟ هذا الرقم خيالي!",
      en: "Can you fly? That's an unrealistic number!",
    },
  },

  // الالتزام
  commitment: {
    fullYearStreak: {
      condition: "days >= 365",
      ar: "عام كامل من التدريب دون توقف؟ هذا التزام أسطوري!",
      en: "A full year of training without stopping? Legendary commitment!",
    },
    longBreak: {
      ar: "لم نرك منذ فترة… هل ما زلت بخير؟",
      en: "We haven't seen you in a while… are you okay?",
    },
  },

  // الوزن
  weight: {
    tooFastLoss: {
      ar: "هذا التغير سريع جدًا، صحتك أهم من الأرقام.",
      en: "This change is too fast. Your health matters more than numbers.",
    },
    largeMassGain: {
      ar: "يبدو أن شهيتك أقوى من تمارينك هذا الأسبوع!",
      en: "Looks like your appetite beat your workouts this week!",
    },
  },

  // رسائل عامة
  general: {
    encouragement: {
      ar: "أداء رائع… إذا كان هذا الرقم صحيحًا فعلًا!",
      en: "Great performance… if that number is actually correct!",
    },
    success: {
      ar: "مذهل! هذا يستحق المكافأة!",
      en: "Amazing! That deserves a reward!",
    },
    warning: {
      ar: "تنبيه: تأكد من البيانات المدخلة",
      en: "Warning: Please verify the entered data",
    },
  },
};

// دالة للتحقق من القيم والحصول على الرسالة
export const getValidationMessage = (
  type: "reps" | "sets" | "minutes" | "caloriesOut" | "caloriesIn" | "weight" | "handstand" | "pullups",
  value: number,
  language: "ar" | "en" = "ar"
) => {
  const val = Number(value);

  if (isNaN(val) || val < 0) {
    return language === "ar"
      ? "القيمة غير صحيحة"
      : "Invalid value";
  }

  let message = null;

  switch (type) {
    case "reps":
      if (val >= 9999) {
        message = validationMessages.workouts.unrealisticReps[language];
      } else if (val > 500) {
        message = validationMessages.general.encouragement[language];
      }
      break;

    case "sets":
      if (val >= 100) {
        message = validationMessages.workouts.largeSets[language];
      }
      break;

    case "minutes":
      if (val >= 300) {
        message = validationMessages.workouts.veryLongDuration[language];
      }
      break;

    case "caloriesOut":
      if (val >= 10000) {
        message = validationMessages.calories.veryHighBurn[language];
      }
      break;

    case "caloriesIn":
      if (val >= 10000) {
        message = validationMessages.calories.massiveIntake[language];
      }
      break;

    case "handstand":
      if (val >= 600) {
        message = validationMessages.skills.handstandTooLong[language];
      }
      break;

    case "pullups":
      if (val >= 1000) {
        message = validationMessages.skills.pullupsTooHigh[language];
      }
      break;
  }

  return message;
};

// دالة للتحقق من جودة الإدخال
export const validateInput = (
  value: number,
  min: number = 0,
  max: number = 999999,
  language: "ar" | "en" = "ar"
): { isValid: boolean; message?: string } => {
  if (isNaN(value) || value < min || value > max) {
    return {
      isValid: false,
      message:
        language === "ar"
          ? `القيمة يجب أن تكون بين ${min} و ${max}`
          : `Value must be between ${min} and ${max}`,
    };
  }

  return { isValid: true };
};
