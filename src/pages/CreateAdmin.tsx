
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const CreateAdmin = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  
  const defaultEmail = "admin@email.com";
  const defaultPassword = "admin";
  const defaultName = "Admin User";

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail,
      password: defaultPassword,
      name: defaultName,
    },
  });

  // Check if admin already exists
  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin');
      
      if (data && data.length > 0) {
        setIsCreated(true);
        setAdminCount(data.length);
      }
    } catch (error) {
      console.error("Error checking admin:", error);
    }
  };

  useEffect(() => {
    checkAdminExists();
  }, []);

  const createAdminAccount = async (values: z.infer<typeof formSchema>) => {
    setIsCreating(true);
    try {
      // Register the admin user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: "admin"
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Update profiles table directly as well (in case trigger doesn't work)
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: values.name,
            email: values.email,
            role: 'admin'
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      toast.success(isRTL ? "تم إنشاء حساب المسؤول بنجاح!" : "Admin account created successfully!");
      setIsCreated(true);
      setAdminCount(prev => prev + 1);
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(error.message || (isRTL ? "فشل في إنشاء حساب المسؤول" : "Failed to create admin account"));
    } finally {
      setIsCreating(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-center">
            {isRTL ? "إعداد حساب المسؤول" : "Admin Account Setup"}
          </CardTitle>
          <CardDescription className="text-center">
            {isRTL ? "أنشئ حساب مسؤول للوصول إلى لوحة التحكم" : "Create an admin account to access the dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCreated ? (
            <div className="space-y-4 text-center">
              <div className="bg-muted p-4 rounded-md">
                <p className="text-lg font-medium text-green-600">
                  {isRTL 
                    ? `يوجد بالفعل ${adminCount} من حسابات المسؤول.`
                    : `${adminCount} admin account${adminCount !== 1 ? 's' : ''} already exist${adminCount === 1 ? 's' : ''}.`}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {isRTL 
                    ? "يمكنك تسجيل الدخول باستخدام بيانات اعتماد المسؤول."
                    : "You can log in using admin credentials."}
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={goToLogin}
              >
                {isRTL ? "الذهاب إلى تسجيل الدخول" : "Go to Login"}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(createAdminAccount)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "الاسم" : "Name"}</FormLabel>
                      <FormControl>
                        <Input placeholder={isRTL ? "اسم المسؤول" : "Admin Name"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "البريد الإلكتروني" : "Email"}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={isRTL ? "البريد الإلكتروني للمسؤول" : "Admin Email"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "كلمة المرور" : "Password"}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder={isRTL ? "كلمة مرور المسؤول" : "Admin Password"} 
                            {...field} 
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <span className="animate-spin mr-2">⌛</span>
                      {isRTL ? "جاري إنشاء المسؤول..." : "Creating Admin..."}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {isRTL ? "إنشاء حساب المسؤول" : "Create Admin Account"}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdmin;
