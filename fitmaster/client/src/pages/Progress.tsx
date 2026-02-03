import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgressSchema, type InsertProgressEntry, type ProgressEntry } from "@shared/schema";
import { getValidationMessages } from "@shared/validation-messages";
import { useProgress, useCreateProgressEntry, useDeleteProgressEntry, useUpdateProgressEntry } from "@/hooks/use-progress";
import { PageHeader } from "@/components/PageHeader";
import { Loader2, Plus, TrendingUp, Trash2, Edit2 } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Progress() {
  const { t, language } = useLanguage();
  const { data: progressData, isLoading } = useProgress();
  const createProgress = useCreateProgressEntry();
  const updateProgress = useUpdateProgressEntry();
  const deleteProgress = useDeleteProgressEntry();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertProgressEntry>({
    resolver: zodResolver(insertProgressSchema),
    defaultValues: {
      date: new Date(),
      weight: "75",
      pullupsMax: 0,
      dipsMax: 0,
      handstandSeconds: 0,
    },
  });

  const onSubmit = (data: InsertProgressEntry) => {
    const messages = getValidationMessages(data, language === 'ar' ? 'ar' : 'en');
    
    if (messages.length > 0) {
      // Show validation messages as toasts
      messages.forEach(message => {
        toast({
          title: "Validation Message",
          description: message,
          variant: "default"
        });
      });
    }
    
    if (editingEntry) {
      updateProgress.mutate({ id: editingEntry.id, data }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingEntry(null);
          form.reset();
          toast({ title: t.edit, description: t.save });
        },
      });
    } else {
      createProgress.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          toast({ title: t.logMetrics, description: t.save });
        },
      });
    }
  };

  const handleEdit = (entry: ProgressEntry) => {
    setEditingEntry(entry);
    form.reset({
      ...entry,
      date: new Date(entry.date)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteProgress.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
          toast({ title: t.delete, description: t.delete });
        }
      });
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  const chartData = progressData
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(p => ({
      ...p,
      dateFormatted: format(new Date(p.date), 'MM/dd'),
      weightNum: Number(p.weight)
    }));

  const ChartCard = ({ title, dataKey, color }: { title: string, dataKey: string, color: string }) => (
    <div className="glass-card rounded-2xl p-6 border-white/5">
      <h3 className="text-xl font-bold mb-6 font-display">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="dateFormatted" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ fill: color, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
      <PageHeader title={t.progress} subtitle={t.weeklyHours}>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingEntry(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl h-12 px-6">
              <Plus className="mr-2 h-5 w-5" /> {t.logMetrics}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">{editingEntry ? t.edit : t.logMetrics}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t.date}</Label>
                <Input type="date" {...form.register("date", { valueAsDate: true })} className="bg-white/5 border-white/10 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.weight} (kg)</Label>
                  <Input type="number" step="0.1" {...form.register("weight")} className="bg-white/5 border-white/10 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label>{t.pullups}</Label>
                  <Input type="number" {...form.register("pullupsMax", { valueAsNumber: true })} className="bg-white/5 border-white/10 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label>{t.dips}</Label>
                  <Input type="number" {...form.register("dipsMax", { valueAsNumber: true })} className="bg-white/5 border-white/10 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label>{t.handstand} (sec)</Label>
                  <Input type="number" {...form.register("handstandSeconds", { valueAsNumber: true })} className="bg-white/5 border-white/10 focus:border-primary" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-xl h-11" disabled={createProgress.isPending || updateProgress.isPending}>
                {(createProgress.isPending || updateProgress.isPending) ? <Loader2 className="animate-spin mr-2" /> : t.save}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {!progressData?.length ? (
        <div className="text-center py-20 bg-card/50 rounded-3xl border border-white/5 border-dashed">
          <TrendingUp className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground">{t.progress}</h3>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <ChartCard title={`${t.weight} (kg)`} dataKey="weightNum" color="#a78bfa" />
            <ChartCard title={t.pullups} dataKey="pullupsMax" color="#34d399" />
            <ChartCard title={t.dips} dataKey="dipsMax" color="#fbbf24" />
            <ChartCard title={`${t.handstand} (s)`} dataKey="handstandSeconds" color="#f472b6" />
          </div>

          <div className="grid gap-4 mt-8">
            <h3 className="text-xl font-bold font-display">{t.weeklyGoal}</h3>
            {progressData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
              <Card key={entry.id} className="glass-card hover:bg-card/90 transition-colors group border-white/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center bg-white/5 w-14 h-14 rounded-xl border border-white/5">
                      <span className="text-[10px] text-muted-foreground font-medium uppercase">{format(new Date(entry.date), "MMM")}</span>
                      <span className="text-lg font-bold text-foreground">{format(new Date(entry.date), "dd")}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div><p className="text-muted-foreground mb-0.5">{t.weight}</p><p className="font-bold">{entry.weight}kg</p></div>
                      <div><p className="text-muted-foreground mb-0.5">{t.pullups}</p><p className="font-bold">{entry.pullupsMax}</p></div>
                      <div><p className="text-muted-foreground mb-0.5">{t.dips}</p><p className="font-bold">{entry.dipsMax}</p></div>
                      <div><p className="text-muted-foreground mb-0.5">{t.handstand}</p><p className="font-bold">{entry.handstandSeconds}s</p></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => handleEdit(entry)}><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => setDeletingId(entry.id)}><Trash2 size={14} /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.delete}</AlertDialogTitle>
            <AlertDialogDescription>{t.delete}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-white/10">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl">{t.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
