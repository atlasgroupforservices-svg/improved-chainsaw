import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCalorieSchema, type InsertCalorieEntry, type CalorieEntry } from "@shared/schema";
import { getValidationMessages } from "@shared/validation-messages";
import { useCalories, useCreateCalorieEntry, useDeleteCalorieEntry, useUpdateCalorieEntry } from "@/hooks/use-calories";
import { PageHeader } from "@/components/PageHeader";
import { Loader2, Plus, Trash2, Flame, ArrowUpCircle, ArrowDownCircle, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function Calories() {
  const { t, language } = useLanguage();
  const { data: calories, isLoading } = useCalories();
  const createEntry = useCreateCalorieEntry();
  const updateEntry = useUpdateCalorieEntry();
  const deleteEntry = useDeleteCalorieEntry();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CalorieEntry | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [superManDialogOpen, setSuperManDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<InsertCalorieEntry | null>(null);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<InsertCalorieEntry>({
    resolver: zodResolver(insertCalorieSchema),
    defaultValues: {
      date: new Date(),
      caloriesIn: 2000,
      caloriesOut: 500,
    },
  });

  const saveEntry = (data: InsertCalorieEntry) => {
    if (editingEntry) {
      updateEntry.mutate({ id: editingEntry.id, data }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingEntry(null);
          form.reset();
          toast({ title: t.edit, description: t.save });
        },
      });
    } else {
      createEntry.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          toast({ title: t.logCalories, description: t.save });
        },
      });
    }
  };

  const confirmSuperMan = () => {
    if (pendingData) {
      saveEntry(pendingData);
      setPendingData(null);
    }
    setSuperManDialogOpen(false);
  };

  const cancelSuperMan = () => {
    form.reset();
    setPendingData(null);
    setSuperManDialogOpen(false);
  };

  const onSubmit = (data: InsertCalorieEntry) => {
    const messages = getValidationMessages(data, language === 'ar' ? 'ar' : 'en');
    
    if (messages.length > 0) {
      // Show validation dialog and wait for confirmation
      setPendingData(data);
      setValidationMessages(messages);
      setSuperManDialogOpen(true);
      return;
    }
    
    saveEntry(data);
  };

  const handleEdit = (entry: CalorieEntry) => {
    setEditingEntry(entry);
    form.reset({
      ...entry,
      date: new Date(entry.date)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteEntry.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
          toast({ title: t.delete, description: t.delete });
        }
      });
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
      <PageHeader 
        title={t.calories} 
        subtitle={t.dailyCalories}
      >
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingEntry(null);
            form.reset({
              date: new Date(),
              caloriesIn: 2000,
              caloriesOut: 500,
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl h-12 px-6">
              <Plus className="mr-2 h-5 w-5" /> {t.logCalories}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-card border-white/10 text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">{editingEntry ? t.edit : t.logCalories}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t.date}</Label>
                <Input 
                  type="date" 
                  {...form.register("date", { valueAsDate: true })} 
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.intake}</Label>
                  <Input 
                    type="number" 
                    {...form.register("caloriesIn", { valueAsNumber: true })} 
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.burned}</Label>
                  <Input 
                    type="number" 
                    {...form.register("caloriesOut", { valueAsNumber: true })} 
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-xl h-11"
                disabled={createEntry.isPending || updateEntry.isPending}
              >
                {(createEntry.isPending || updateEntry.isPending) ? <Loader2 className="animate-spin mr-2" /> : t.save}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4">
        {!calories?.length ? (
          <div className="text-center py-20 bg-card/50 rounded-3xl border border-white/5 border-dashed">
            <Flame className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">{t.calories}</h3>
          </div>
        ) : (
          calories.map((entry) => {
            const balance = entry.caloriesIn - entry.caloriesOut;
            const isSurplus = balance > 0;

            return (
              <Card key={entry.id} className="glass-card hover:bg-card/90 transition-colors group border-white/5">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center bg-white/5 w-16 h-16 rounded-xl border border-white/5">
                      <span className="text-xs text-muted-foreground font-medium uppercase">
                        {format(new Date(entry.date), "MMM")}
                      </span>
                      <span className="text-xl font-bold text-foreground">
                        {format(new Date(entry.date), "dd")}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-8 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><ArrowUpCircle size={14} className="text-emerald-500" /> {t.intake}</p>
                        <p className="text-lg font-bold">{entry.caloriesIn}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><ArrowDownCircle size={14} className="text-amber-500" /> {t.burned}</p>
                        <p className="text-lg font-bold">{entry.caloriesOut}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">{t.net}</p>
                        <p className={`text-lg font-bold ${isSurplus ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {balance > 0 ? '+' : ''}{balance}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeletingId(entry.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.delete}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.delete}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-white/10">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={superManDialogOpen} onOpenChange={(open) => {
        setSuperManDialogOpen(open);
        if (!open) {
          setPendingData(null);
          setValidationMessages([]);
        }
      }}>
        <AlertDialogContent className="bg-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'رسالة تحذير' : 'Warning Message'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-4 space-y-3">
              {validationMessages.map((message, index) => (
                <div key={index} className="text-white/90 font-semibold text-lg">
                  ⚠️ {message}
                </div>
              ))}
              <div className="mt-6 text-sm text-white/70">
                {language === 'ar' ? 'هل تريد المتابعة مع هذه القيم؟' : 'Do you want to continue with these values?'}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelSuperMan} className="rounded-xl border-white/10">
              {t.no}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuperMan} className="bg-primary hover:bg-primary/90 rounded-xl">
              {t.yes}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
