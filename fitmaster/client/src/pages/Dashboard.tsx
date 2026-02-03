import { useWorkouts } from "@/hooks/use-workouts";
import { useCalories } from "@/hooks/use-calories";
import { useProgress } from "@/hooks/use-progress";
import { useProfile, calculateBMI, getBMICategory } from "@/hooks/use-profile";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { PageHeader } from "@/components/PageHeader";
import { StatsCard } from "@/components/StatsCard";
import { 
  Loader2, 
  Flame, 
  Timer, 
  Scale, 
  PieChart as PieIcon,
  BarChart as BarIcon,
  Download,
  Upload,
  Trophy
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";
import { 
  startOfWeek, 
  endOfWeek, 
  isWithinInterval, 
  subWeeks, 
  format, 
  startOfDay,
  subDays
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";

export default function Dashboard() {
  // All hooks MUST be called at the top, before any conditionals
  const { t, language, isRTL } = useLanguage();
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts();
  const { data: calories, isLoading: caloriesLoading } = useCalories();
  const { data: progressEntries, isLoading: progressLoading } = useProgress();
  const { data: profile } = useProfile();
  const { data: goalsData } = useQuery({
    queryKey: [api.goals.list.path],
    queryFn: async () => {
      const res = await fetch(api.goals.list.path);
      if (!res.ok) return [];
      return await res.json();
    }
  });
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('week');
  const { toast } = useToast();

  if (workoutsLoading || caloriesLoading || progressLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const now = new Date();
  const filterInterval = {
    start: filter === 'day' ? startOfDay(now) : (filter === 'week' ? startOfWeek(now, { weekStartsOn: 1 }) : subDays(now, 30)),
    end: now
  };

  const currentWorkouts = workouts?.filter(w => isWithinInterval(new Date(w.date), filterInterval)) || [];
  const currentCalories = calories?.filter(c => isWithinInterval(new Date(c.date), filterInterval)) || [];

  const totalMinutes = currentWorkouts.reduce((acc, w) => acc + w.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const bmi = profile ? calculateBMI(profile.height, profile.weight) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  const avgCaloriesIn = currentCalories.length > 0 
    ? Math.round(currentCalories.reduce((acc, c) => acc + c.caloriesIn, 0) / currentCalories.length) 
    : 0;
  
  const todayCaloriesEntries = calories?.filter(c => {
    const d = new Date(c.date);
    return d.getDate() === now.getDate() && 
           d.getMonth() === now.getMonth() && 
           d.getFullYear() === now.getFullYear();
  }) || [];

  const netCaloriesToday = todayCaloriesEntries.reduce((acc, c) => acc + (c.caloriesIn - c.caloriesOut), 0);
  const latestWeight = progressEntries?.length ? progressEntries[0].weight : "--";

  const weeklyHoursGoal = (goalsData || []).find((g: any) => g.metric === 'weekly_hours')?.target || 5;
  const trainingProgress = Math.min((Number(totalHours) / Number(weeklyHoursGoal)) * 100, 100);

  const typeDistribution = currentWorkouts.reduce((acc: any, w) => {
    acc[w.type] = (acc[w.type] || 0) + w.minutes;
    return acc;
  }, {});
  const pieData = Object.entries(typeDistribution).map(([name, value]) => ({ name, value }));
  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const last4Weeks = [3, 2, 1, 0].map(weeksAgo => {
    const start = startOfWeek(subWeeks(now, weeksAgo), { weekStartsOn: 1 });
    const end = endOfWeek(subWeeks(now, weeksAgo), { weekStartsOn: 1 });
    const weekWorkouts = workouts?.filter(w => isWithinInterval(new Date(w.date), { start, end })) || [];
    const mins = weekWorkouts.reduce((acc, w) => acc + w.minutes, 0);
    return {
      name: `W${4-weeksAgo}`,
      hours: Number((mins / 60).toFixed(1))
    };
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <PageHeader 
          title={t.dashboard} 
          subtitle={language === "ar" ? "نظرة شاملة على تدريبك ومقاييسك الصحية." : "A comprehensive view of your training and health metrics."}
        />
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[140px] bg-card border-border rounded-xl h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{language === "ar" ? "اليوم" : "Today"}</SelectItem>
              <SelectItem value="week">{language === "ar" ? "هذا الأسبوع" : "This Week"}</SelectItem>
              <SelectItem value="month">{language === "ar" ? "آخر 30 يوم" : "Last 30 Days"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title={t.trainingHours} 
          value={`${totalHours}h`} 
          subtitle={filter === 'week' ? (language === "ar" ? "هذا الأسبوع" : "This week") : ""}
          icon={Timer} 
          description={`${trainingProgress.toFixed(0)}% ${language === "ar" ? "من الهدف" : "of goal"}`}
          color="primary"
        />
        <StatsCard 
          title={t.dailyCalories} 
          value={netCaloriesToday.toString()} 
          subtitle={language === "ar" ? "صافي الرصيد اليوم" : "Net balance today"}
          icon={Flame} 
          color={netCaloriesToday > 500 ? "warning" : "success"}
        />
        <StatsCard 
          title={language === "ar" ? "متوسط السعرات" : "Avg Calories"} 
          value={avgCaloriesIn.toString()} 
          subtitle={language === "ar" ? "الاستهلاك اليومي" : "Daily intake"}
          icon={Flame} 
          color="warning"
        />
        {bmi ? (
          <Card className="bg-card flex flex-col justify-center px-6 py-4 border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {language === "ar" ? "مؤشر الجسم" : "BMI"}
              </span>
              <Scale className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">{bmi.toFixed(1)}</span>
              <span className={`text-sm font-medium ${bmiCategory?.color}`}>
                {language === "ar" ? bmiCategory?.ar : bmiCategory?.label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {profile?.weight} {language === "ar" ? "كجم" : "kg"} • {profile?.height} {language === "ar" ? "سم" : "cm"}
            </div>
          </Card>
        ) : (
          <Card className="bg-card flex flex-col justify-center px-6 py-4 border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{t.weeklyGoal}</span>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold">{totalHours}</span>
              <span className="text-sm text-muted-foreground">/ {weeklyHoursGoal}h</span>
            </div>
            <Progress value={trainingProgress} className="h-2" />
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-card rounded-2xl overflow-hidden border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2 p-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieIcon size={20} className="text-primary" /> {t.trainingSplit}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {language === "ar" ? "لا توجد بيانات تدريب لهذه الفترة" : "No training data for this period"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-2xl overflow-hidden border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2 p-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarIcon size={20} className="text-blue-500" /> {t.weeklyHours}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last4Weeks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
