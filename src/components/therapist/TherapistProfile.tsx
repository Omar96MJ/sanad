
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Mail, Lock, Image, Video } from "lucide-react";

const TherapistProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("I am a licensed therapist with over 10 years of experience in cognitive behavioral therapy. I specialize in anxiety, depression, and stress management.");
  const [specialization, setSpecialization] = useState("Cognitive Behavioral Therapy");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [introVideo, setIntroVideo] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('profile_updated'));
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error(t('passwords_dont_match'));
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error(t('password_too_short'));
      return;
    }
    
    toast.success(t('password_updated'));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
            <CardDescription>{t('manage_your_public_information')}</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileImage} alt={name} />
                  <AvatarFallback className="text-lg">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Label htmlFor="profileImage" className="cursor-pointer bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90">
                    <Image className="h-4 w-4 inline-block mr-1" />
                    {t('change_picture')}
                  </Label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Mock upload - in a real app, upload to server and get URL
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setProfileImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
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
                <Label htmlFor="specialization">{t('specialization')}</Label>
                <Input 
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">{t('bio')}</Label>
                <Textarea 
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`min-h-32 ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="introVideo">{t('introduction_video')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="introVideo"
                    type="file"
                    accept="video/*"
                    className={isRTL ? 'text-right' : 'text-left'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Mock upload - in a real app, upload to server and get URL
                        setIntroVideo(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <Button type="button" size="sm" variant="outline">
                    <Video className="h-4 w-4 mr-1" />
                    {t('upload')}
                  </Button>
                </div>
                {introVideo && (
                  <div className="mt-4">
                    <video controls className="w-full h-auto rounded-md">
                      <source src={introVideo} />
                      {t('browser_not_support_video')}
                    </video>
                  </div>
                )}
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
                <p className="text-sm text-muted-foreground">{t('email_private')}</p>
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
                  <Label htmlFor="currentPassword">{t('current_password')}</Label>
                  <Input 
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>
                
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
                
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>{t('password_requirements')}:</p>
                  <ul className="list-disc list-inside">
                    <li>{t('min_eight_characters')}</li>
                    <li>{t('at_least_one_number')}</li>
                    <li>{t('at_least_one_special')}</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">{t('update_password')}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;
