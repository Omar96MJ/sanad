
import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, AlertCircle, Shield, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const isRTL = language === 'ar';

  useEffect(() => {
    // Retrieve email from sessionStorage
    const savedEmail = sessionStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required. Please go back to the forgot password page.");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Verify OTP and create new session
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      });
      
      if (error) {
        throw error;
      }
      
      setIsVerified(true);
      toast.success("Verification successful. You can now reset your password.");
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message || t('verification_failed'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('passwords_dont_match'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast.success(t('password_updated'));
      
      // Clear the stored email
      sessionStorage.removeItem('resetEmail');
      
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

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email is required. Please go back to the forgot password page.");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw error;
      }
      
      toast.success(t('password_reset_email_sent'));
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || t('password_reset_failed'));
    } finally {
      setIsVerifying(false);
    }
  };

  if (!email) {
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
            <h2 className="mt-6 text-3xl font-bold">
              {isVerified ? t('create_new_password') : t('reset_your_password')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isVerified ? t('enter_new_password') : t('enter_verification_code')}
            </p>
          </div>
          
          <div className="mt-8 bg-card border border-border/50 rounded-lg p-6 shadow-sm">
            {isVerified ? (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('new_password')}</Label>
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
            ) : (
              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div className="space-y-4">
                  <Label htmlFor="otp">{t('verification_code')}</Label>
                  <div className="flex justify-center py-2">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {t('enter_verification_code')}
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full btn-primary" 
                    disabled={isVerifying || otp.length < 6}
                  >
                    {isVerifying ? t('verifying') : t('verify_and_continue')}
                  </Button>
                  
                  <div className="flex items-center justify-between">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleResendOtp}
                      disabled={isVerifying}
                    >
                      {t('resend_code')}
                    </Button>
                    
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm"
                    >
                      <Link to="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('back_to_login')}
                      </Link>
                    </Button>
                  </div>
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

export default ResetPassword;
