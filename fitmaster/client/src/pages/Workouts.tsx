import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWorkoutSchema, type InsertWorkout, type Workout } from "@shared/schema";
import { getValidationMessages } from "@shared/validation-messages";
import { useWorkouts, useCreateWorkout, useDeleteWorkout, useUpdateWorkout } from "@/hooks/use-workouts";
import { PageHeader } from "@/components/PageHeader";
import { Loader2, Plus, Trash2, Timer, Dumbbell, Repeat, Edit2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const WORKOUT_TYPES = ["Push", "Pull", "Legs", "Skills", "Cardio", "Mobility"];

export default function Workouts() {
  const { t, language } = useLanguage();
  const { data: workouts, isLoading } = useWorkouts();
  const createWorkout = useCreateWorkout();
  const updateWorkout = useUpdateWorkout();
  const deleteWorkout = useDeleteWorkout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [superManDialogOpen, setSuperManDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<InsertWorkout | null>(null);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<InsertWorkout>({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: {
      date: new Date(),
      type: "Push",
      exercise: "",
      sets: 3,
      reps: 10,
      minutes: 30,
    },
  });

  const saveWorkout = (data: InsertWorkout) => {
    if (editingWorkout) {
      updateWorkout.mutate({ id: editingWorkout.id, data }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingWorkout(null);
          form.reset();
          toast({ title: t.edit, description: t.save });
        },
      });
    } else {
      createWorkout.mutate(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          toast({ title: t.logWorkout, description: t.save });
        },
      });
    }
  };

  const confirmSuperMan = () => {
    if (pendingData) {
      saveWorkout(pendingData);
      setPendingData(null);
    }
    setSuperManDialogOpen(false);
  };

  const cancelSuperMan = () => {
    form.reset();
    setPendingData(null);
    setSuperManDialogOpen(false);
  };

  const onSubmit = (data: InsertWorkout) => {
    const messages = getValidationMessages(data, language === 'ar' ? 'ar' : 'en');
    
    if (messages.length > 0) {
      // Show validation dialog and wait for confirmation
      setPendingData(data);
      setValidationMessages(messages);
      setSuperManDialogOpen(true);
      return;
    }
    
    saveWorkout(data);
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    form.reset({
      ...workout,
      date: new Date(workout.date)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteWorkout.mutate(deletingId, {
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
        title={t.workouts} 
        subtitle={t.trainingSplit}
      >
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingWorkout(null);
            form.reset({
              date: new Date(),
              type: "Push",
              exercise: "",
              sets: 3,
              reps: 10,
              minutes: 30,
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl h-12 px-6">
              <Plus className="mr-2 h-5 w-5" /> {t.logWorkout}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-foreground">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">{editingWorkout ? t.edit : t.logWorkout}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.date}</Label>
                  <Input 
                    type="date" 
                    {...form.register("date", { valueAsDate: true })} 
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                  {form.formState.errors.date && <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t.type}</Label>
                  <Select 
                    onValueChange={(val) => form.setValue("type", val)}
                    defaultValue={form.getValues("type")}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 focus:ring-primary">
                      <SelectValue placeholder={t.type} />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKOUT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.exercise}</Label>
                <Input 
                  placeholder={t.exercise} 
                  {...form.register("exercise")} 
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
                {form.formState.errors.exercise && <p className="text-xs text-destructive">{form.formState.errors.exercise.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t.sets}</Label>
                  <Input 
                    type="number" 
                    {...form.register("sets", { valueAsNumber: true })}
                    className="bg-white/5 border-white/10 focus:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.reps}</Label>
                  <Input 
                    type="number" 
                    {...form.register("reps", { valueAsNumber: true })} 
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.minutes}</Label>
                  <Input 
                    type="number" 
                    {...form.register("minutes", { valueAsNumber: true })} 
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-xl h-11 text-base font-semibold"
                disabled={createWorkout.isPending || updateWorkout.isPending}
              >
                {(createWorkout.isPending || updateWorkout.isPending) ? <Loader2 className="animate-spin mr-2" /> : t.save}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4">
        {!workouts?.length ? (
          <div className="text-center py-20 bg-card/50 rounded-3xl border border-white/5 border-dashed">
            <Dumbbell className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">{t.workouts}</h3>
          </div>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id} className="glass-card hover:bg-card/90 transition-colors group border-white/5">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center bg-white/5 w-16 h-16 rounded-xl border border-white/5">
                    <span className="text-xs text-muted-foreground font-medium uppercase">
                      {format(new Date(workout.date), "MMM")}
                    </span>
                    <span className="text-xl font-bold text-foreground">
                      {format(new Date(workout.date), "dd")}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-foreground">{workout.exercise}</h3>
                      <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary border border-primary/20 font-medium">
                        {workout.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Repeat size={14} /> {workout.sets} x {workout.reps}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Timer size={14} /> {workout.minutes} {t.minutes}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                    onClick={() => handleEdit(workout)}
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeletingId(workout.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
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
