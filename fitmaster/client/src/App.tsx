import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "@/pages/Dashboard";
import Workouts from "@/pages/Workouts";
import Calories from "@/pages/Calories";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

function Router() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/calories" component={Calories} />
      <Route path="/progress" component={Progress} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Router />;
  }

  return (
    <>
      <AppSidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header with Menu Button */}
        <MobileMenuButton />
        <div className="flex-1 overflow-auto">
          <Router />
        </div>
      </main>
    </>
  );
}

function MobileMenuButton() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();

  if (!isMobile || !user) return null;

  return (
    <div className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleSidebar}
        className="h-9 w-9"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}

function AppWithProviders() {
  const { user } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  // فقط استخدم SidebarProvider عندما يكون هناك مستخدم
  if (!user) {
    return (
      <TooltipProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
          <AppContent />
          <Toaster />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
          <AppContent />
          <Toaster />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppWithProviders />
          </ThemeProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
