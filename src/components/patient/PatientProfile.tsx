
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Mail, Lock, Activity } from "lucide-react";
import { fetchUserProfile, ProfileData, uploadProfileImage, updateUserProfileData, updateUserProfileImage } from "@/services/patientService";
import { supabase } from "@/integrations/supabase/client";


const PatientProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // سيبقى من user.email عادةً
  const [about, setAbout] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // حالة تحميل جديدة
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const loadProfile = async () => {
        setIsLoadingProfile(true);
        const profileData = await fetchUserProfile(user.id);
        if (profileData) {
          setName(profileData.name || "");
          setEmail(user.email || ""); // البريد من auth.user هو المصدر الرئيسي عادةً
          setAbout(profileData.about_me || "");
          setProfileImage(profileData.profile_image || null);
        }
        setIsLoadingProfile(false);
      };
      loadProfile();
    } else {
      setIsLoadingProfile(false); // لا يوجد مستخدم، أوقف التحميل
    }
  }, [user]);


    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

  const updates = {
    name: name,
    about_me: about,
    };
    await updateUserProfileData(user.id, updates);
    toast.success(t('profile_updated'));
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error(t('passwords_dont_match'));
    return;
  }
  if (newPassword.length < 8) { // أو أي طول أدنى تحدده Supabase أو أنت
    toast.error(t('password_too_short'));
    return;
  }

  setIsUpdatingPassword(true);
  try {
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error("Error updating password:", error);
      toast.error(t('error_updating_password'));
    } else {
      toast.success(t('password_updated_successfully'));
      // مسح الحقول بعد النجاح
      setNewPassword("");
      setConfirmPassword("");
    }
  } catch (error) {
    console.error("Exception updating password:", error);
    toast.error(t('unexpected_error_password_update'));
  } finally {
    setIsUpdatingPassword(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('profile_information')}
            </CardTitle>
            <CardDescription>{t('manage_your_information')}</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileImage} alt={name} />
                  <AvatarFallback className="text-lg">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <Label htmlFor="profileImage" className="cursor-pointer bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90">
                    {t('change_picture')}
                  </Label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && user?.id) {
                        // يمكنك عرض مؤشر تحميل هنا
                        const publicUrl = await uploadProfileImage(user.id, file);
                        if (publicUrl) {
                          const success = await updateUserProfileImage(user.id, publicUrl);
                          if (success) {
                            setProfileImage(publicUrl); // تحديث الواجهة فورًا بالصورة الجديدة
                          }
                        }
                        // إيقاف مؤشر التحميل
                      }
                      // لمنع إعادة إرسال الملف عند تحديث الصفحة، قم بإعادة تعيين قيمة حقل الإدخال
                      e.target.value = ""; 
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">{t('full_name')}</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">{t('about_me')}</Label>
                <Textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className={`min-h-24 ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">{t('save_changes')}</Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Account Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('email_settings')}
              </CardTitle>
              <CardDescription>{t('manage_your_email_address')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email_address')}</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => toast.success(t('verification_email_sent'))}>
                {t('verify_email')}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t('security')}
              </CardTitle>
              <CardDescription>{t('manage_your_password')}</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('new_password')}</Label>
                  <Input 
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">{t('update_password')}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Health Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('health_information')}
          </CardTitle>
          <CardDescription>{t('your_health_records')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium">{t('recent_sessions')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('no_recent_sessions')}
              </p>
              <Button size="sm" variant="outline" className="mt-2">
                {t('book_a_session')}
              </Button>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium">{t('psychological_tests')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('no_tests_completed')}
              </p>
              <Button size="sm" variant="outline" className="mt-2">
                {t('take_a_test')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;
