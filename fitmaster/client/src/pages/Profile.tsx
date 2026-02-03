import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

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

export default function Profile() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    height: "180",
    weight: "75",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setFormData({
            height: data.height?.toString() || "180",
            weight: data.weight?.toString() || "75",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const height = parseFloat(formData.height);
      const weight = parseFloat(formData.weight);
      
      if (isNaN(height) || isNaN(weight)) {
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "الرجاء إدخال قيم صحيحة" : "Please enter valid values",
          variant: "destructive",
        });
        return;
      }

      if (height <= 0 || weight <= 0) {
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "القيم يجب أن تكون أكبر من صفر" : "Values must be greater than zero",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height, weight })
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast({
        title: language === 'ar' ? "نجح" : "Success",
        description: language === 'ar' ? "تم حفظ البيانات" : "Profile saved",
      });

      setTimeout(() => setLocation("/"), 1500);
    } catch (error) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? "الملف الشخصي" : "Profile"}
          </h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className={`w-24 h-24 mb-4 ${getAvatarColor(user?.id)}`}>
                <AvatarFallback className="text-white text-2xl">
                  {getInitials(user?.id)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {user?.id?.split("@")[0] || language === 'ar' ? "مستخدم" : "User"}
              </h2>
              <p className="text-muted-foreground text-lg">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        {initialLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? "تحرير البيانات" : "Edit"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-base">
                  {language === 'ar' ? "الطول (سم)" : "Height (cm)"}
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="text-base h-10"
                  min="0"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? `الطول: ${formData.height} سم` : `Height: ${formData.height} cm`}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-base">
                  {language === 'ar' ? "الوزن (كجم)" : "Weight (kg)"}
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="text-base h-10"
                  min="0"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? `الوزن: ${formData.weight} كجم` : `Weight: ${formData.weight} kg`}
                </p>
              </div>

              {formData.height && formData.weight && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'ar' ? "مؤشر كتلة الجسم" : "BMI"}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {(parseFloat(formData.weight) / (Math.pow(parseFloat(formData.height) / 100, 2))).toFixed(1)}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'ar' ? "جاري..." : "Saving..."}
                    </>
                  ) : (
                    language === 'ar' ? "حفظ" : "Save"
                  )}
                </Button>
                <Button
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="flex-1"
                >
                  {language === 'ar' ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
