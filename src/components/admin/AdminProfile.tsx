
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Mail, Lock, Shield, Settings } from "lucide-react";

const AdminProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageContent: true,
    manageSettings: true
  });
  
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

  const togglePermission = (permission: keyof typeof permissions) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission]
    });
    toast.success(`${permission} ${permissions[permission] ? t('disabled') : t('enabled')}`);
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Mock upload
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
            </CardContent>
            <CardFooter>
              <Button type="submit">{t('save_changes')}</Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Account and Security Settings */}
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
              </CardContent>
              <CardFooter>
                <Button type="submit">{t('update_password')}</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      {/* Admin Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('admin_permissions')}
          </CardTitle>
          <CardDescription>{t('manage_your_admin_permissions')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('manage_users')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('permission_to_manage_users')}
              </p>
            </div>
            <Switch 
              checked={permissions.manageUsers}
              onCheckedChange={() => togglePermission('manageUsers')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('manage_content')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('permission_to_manage_content')}
              </p>
            </div>
            <Switch 
              checked={permissions.manageContent}
              onCheckedChange={() => togglePermission('manageContent')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('system_settings')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('permission_to_manage_settings')}
              </p>
            </div>
            <Switch 
              checked={permissions.manageSettings}
              onCheckedChange={() => togglePermission('manageSettings')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
