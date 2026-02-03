import { 
  LayoutDashboard, 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Settings,
  Moon,
  Sun,
  Languages,
  LogOut,
  User,
  ChevronUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { signOut, user } = useAuth();

  const menuItems = [
    { title: t.dashboard, icon: LayoutDashboard, url: "/" },
    { title: t.workouts, icon: Dumbbell, url: "/workouts" },
    { title: t.calories, icon: Flame, url: "/calories" },
    { title: t.progress, icon: TrendingUp, url: "/progress" },
  ];

  const getInitials = (email?: string) => {
    if (!email) return "U";
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (email?: string) => {
    if (!email) return "bg-blue-500";
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Sidebar side={isRTL ? "right" : "left"} className="border-border">
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 font-display">
            <Dumbbell className="text-primary h-8 w-8" />
            <span>FITNESS</span>
          </h1>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    tooltip={item.title}
                    className="h-12 px-4 rounded-xl transition-all"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${location === item.url ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        {/* User Profile with Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full mx-0 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className={`w-10 h-10 ${getAvatarColor(user?.id)}`}>
                  <AvatarFallback className="text-white font-bold text-xs">
                    {getInitials(user?.id)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-right min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user?.user_metadata?.name || user?.id?.split("@")[0] || "مستخدم"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.id}
                  </p>
                </div>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "end" : "start"} className="w-56">
            <DropdownMenuItem onClick={() => setLocation("/profile")}>
              <User className="h-4 w-4 mr-2" />
              <span>معلومات الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLanguage(language === "en" ? "ar" : "en")}>
              <Languages className="h-4 w-4 mr-2" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              <span>{theme === "dark" ? (language === "ar" ? "الوضع الفاتح" : "Light Mode") : (language === "ar" ? "الوضع الداكن" : "Dark Mode")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              <span>{t.signOut}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
