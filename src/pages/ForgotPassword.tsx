
import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { t, language } = useLanguage();
  
  const isRTL = language === 'ar';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setResetSent(true);
      toast.success(t('password_reset_email_sent'));
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || t('password_reset_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 fade-in">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">{t('reset_your_password')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {resetSent ? t('check_your_email') : t('enter_email_for_reset')}
            </p>
          </div>
          
          <div className="mt-8 bg-card border border-border/50 rounded-lg p-6 shadow-sm">
            {resetSent ? (
              <div className="text-center space-y-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t('email_sent')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('password_reset_instructions_sent')}
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('back_to_login')}
                  </Link>
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email_address')}</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email_address')}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>

                <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    {t('password_reset_info')}
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full btn-primary" 
                    disabled={isLoading}
                  >
                    {isLoading ? t('sending') : t('send_reset_link')}
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('back_to_login')}
                    </Link>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
