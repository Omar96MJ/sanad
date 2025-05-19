
import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UserRole } from "@/lib/types";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  
  const { register, isLoading, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const isRTL = language === 'ar';

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await register(name, email, password, role);
      // AuthProvider will handle session and user state
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 fade-in">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">{t('create_account')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('join_us')}
            </p>
          </div>
          
          <div className="mt-8 bg-card border border-border/50 rounded-lg p-6 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">{t('full_name')}</Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  autoComplete="name" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('full_name')}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="new-password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('create_password')}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">{t('i_am_a')} :</Label>
                <Select 
                  value={role} 
                  onValueChange={(value) => setRole(value as UserRole)}
                >
                  <SelectTrigger className={`${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                    <SelectValue placeholder={t('i_am_a')} />
                  </SelectTrigger>
                  <SelectContent className={isRTL ? 'text-right' : 'text-left'}>
                    <SelectItem 
                      value="patient"
                      className={`flex items-center ${isRTL ? 'justify-end text-right' : 'justify-start text-left'}`}
                    >
                      {t('person_seeking_guidance')}
                    </SelectItem>
                    <SelectItem 
                    value="doctor"
                    className={`flex items-center ${isRTL ? 'justify-end text-right' : 'justify-start text-left'}`}
                    >
                      {t('support_specialist')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary" 
                disabled={isLoading}
              >
                {isLoading ? t('creating_account') : t('create_account')}
              </Button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('already_have_account')}{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
