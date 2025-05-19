
import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, AlertCircle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const isRTL = language === 'ar';

  // Check if the user accessed this page through a valid recovery link
  useEffect(() => {
    const checkRecoveryLink = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setIsValidLink(false);
      }
    };
    
    checkRecoveryLink();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      toast.error(t('passwords_dont_match'));
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast.success(t('password_updated'));
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || t('password_update_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-grow mt-16 md:mt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 fade-in">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="mt-6 text-3xl font-bold">{t('invalid_link')}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('invalid_reset_link_description')}
              </p>
              <Button asChild className="mt-6">
                <Link to="/forgot-password">
                  {t('request_new_link')}
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 fade-in">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">{t('create_new_password')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('enter_new_password')}
            </p>
          </div>
          
          <div className="mt-8 bg-card border border-border/50 rounded-lg p-6 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="password">{t('new_password')}</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type="password"
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={isRTL ? 'text-right' : 'text-left'}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                <KeyRound className="h-4 w-4 mr-2" />
                <AlertDescription>
                  {t('password_strength_tip')}
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full btn-primary" 
                disabled={isLoading}
              >
                {isLoading ? t('updating') : t('update_password')}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
