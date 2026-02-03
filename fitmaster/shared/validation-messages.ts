// Validation messages for unrealistic values
export const getValidationMessages = (data: any, language: 'ar' | 'en' = 'ar'): string[] => {
  const messages: string[] = [];

  // Check for unrealistic reps
  if (data.reps !== undefined && data.reps >= 9999) {
    messages.push(language === 'ar' 
      ? "هل أنت إنسان أم سوبرمان؟ هذا الرقم غير منطقي!"
      : "Are you human or Superman? This number doesn't look realistic!");
  }

  // Check for unrealistic sets
  if (data.sets !== undefined && data.sets >= 100) {
    messages.push(language === 'ar'
      ? "هذا ليس تمرينًا… هذا اختبار صبر خارق!"
      : "This isn't a workout… it's a test of superhuman patience!");
  }

  // Check for unrealistic duration (5+ hours = 300+ minutes)
  if (data.minutes !== undefined && data.minutes >= 300) {
    messages.push(language === 'ar'
      ? "خمس ساعات تدريب؟ يبدو أنك تعيش في صالة الرياضة!"
      : "Five hours of training? Looks like you live at the gym!");
  }

  // Check for unrealistic calories burned
  if (data.caloriesOut !== undefined && data.caloriesOut >= 10000) {
    messages.push(language === 'ar'
      ? "هل شاركت في سباق ماراثون أم هربت من خطر ما؟"
      : "Did you run a marathon or escape from danger?");
  }

  // Check for unrealistic calories intake
  if (data.caloriesIn !== undefined && data.caloriesIn >= 10000) {
    messages.push(language === 'ar'
      ? "هذه كمية سعرات كافية لإطعام فريق كامل!"
      : "That's enough calories to feed an entire team!");
  }

  return messages;
};
