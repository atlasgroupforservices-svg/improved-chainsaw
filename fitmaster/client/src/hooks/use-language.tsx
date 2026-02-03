import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface Translation {
  dashboard: string;
  workouts: string;
  calories: string;
  progress: string;
  trainingHours: string;
  dailyCalories: string;
  currentWeight: string;
  weeklyGoal: string;
  trainingSplit: string;
  weeklyHours: string;
  logWorkout: string;
  logCalories: string;
  logMetrics: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  date: string;
  type: string;
  exercise: string;
  sets: string;
  reps: string;
  minutes: string;
  weight: string;
  pullups: string;
  dips: string;
  handstand: string;
  intake: string;
  burned: string;
  net: string;
  signUp: string;
  signIn: string;
  createAccount: string;
  login: string;
  email: string;
  password: string;
  name: string;
  age: string;
  height: string;
  
  heightCm: string;
  weightKg: string;
  accountExists: string;
  noAccount: string;
  invalidCredentials: string;
  signOut: string;
  signUpDescription: string;
  signInDescription: string;
  superManMessage: string;
  yes: string;
  no: string;
}

const translations: Record<Language, Translation> = {
  en: {
    dashboard: "Dashboard",
    workouts: "Workouts",
    calories: "Calories",
    progress: "Progress",
    trainingHours: "Training Hours",
    dailyCalories: "Daily Calories",
    currentWeight: "Current Weight",
    weeklyGoal: "Weekly Goal",
    trainingSplit: "Training Split",
    weeklyHours: "Weekly Hours",
    logWorkout: "Log Workout",
    logCalories: "Log Calories",
    logMetrics: "Log Metrics",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    date: "Date",
    type: "Type",
    exercise: "Exercise",
    sets: "Sets",
    reps: "Reps",
    minutes: "Minutes",
    weight: "Weight",
    pullups: "Pullups",
    dips: "Dips",
    handstand: "Handstand",
    intake: "Intake",
    burned: "Burned",
    net: "Net",
    signUp: "Sign Up",
    signIn: "Sign In",
    createAccount: "Create Account",
    login: "Login",
    email: "Email",
    password: "Password",
    name: "Name",
    age: "Age",
    height: "Height",
    heightCm: "Height (cm)",
    weightKg: "Weight (kg)",
    accountExists: "Account already exists. Please log in instead.",
    noAccount: "No account found. Please create an account.",
    invalidCredentials: "Invalid email or password. Please check your details or create an account.",
    signOut: "Sign Out",
    signUpDescription: "Create a new account",
    signInDescription: "Log in to your account",
    superManMessage: "Are you super man?",
    yes: "Yes",
    no: "No",
  },
  ar: {
    dashboard: "لوحة التحكم",
    workouts: "التمارين",
    calories: "السعرات",
    progress: "التقدم",
    trainingHours: "ساعات التدريب",
    dailyCalories: "السعرات اليومية",
    currentWeight: "الوزن الحالي",
    weeklyGoal: "الهدف الأسبوعي",
    trainingSplit: "توزيع التدريب",
    weeklyHours: "الساعات الأسبوعية",
    logWorkout: "تسجيل تمرين",
    logCalories: "تسجيل سعرات",
    logMetrics: "تسجيل قياسات",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    date: "التاريخ",
    type: "النوع",
    exercise: "التمرين",
    sets: "الجولات",
    reps: "التكرارات",
    minutes: "الدقائق",
    weight: "الوزن",
    pullups: "العقلة",
    dips: "المتوازي",
    handstand: "الوقوف على اليدين",
    intake: "المأخوذ",
    burned: "المحروق",
    net: "الصافي",
    signUp: "إنشاء حساب",
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم",
    age: "العمر",
    height: "الطول",
    heightCm: "الطول (سم)",
    weightKg: "الوزن (كجم)",
    accountExists: "الحساب موجود بالفعل. المرجو تسجيل الدخول بدلاً من ذلك.",
    noAccount: "لا يوجد حساب. المرجو إنشاء حساب.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة. المرجو التحقق من البيانات أو إنشاء حساب جديد.",
    signOut: "تسجيل الخروج",
    signUpDescription: "إنشاء حساب جديد",
    signInDescription: "تسجيل الدخول إلى حسابك",
    superManMessage: "هل أنت سوبر مان؟",
    yes: "نعم",
    no: "لا",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("app-language") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
