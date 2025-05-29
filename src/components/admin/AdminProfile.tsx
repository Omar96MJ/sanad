
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminProfile } from "@/hooks/useAdminProfile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Mail, Lock, Shield } from "lucide-react";

const AdminProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { adminSettings, isLoading, updateProfile, updatePermissions, uploadProfileImage } = useAdminProfile();
  const isRTL = language === 'ar';
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(name);
    if (success) {
      // Update will be reflected through the auth context
    }
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadProfileImage(file);
    if (imageUrl) {
      await updateProfile(name, imageUrl);
    }
  };

  const togglePermission = async (permission: keyof typeof adminSettings.permissions) => {
    if (!adminSettings) return;
    
    const newPermissions = {
      ...adminSettings.permissions,
      [permission]: !adminSettings.permissions[permission]
    };
    
    await updatePermissions(newPermissions);
  };

  // Fix: Use profileImage instead of profile_image
  const currentProfileImage = user?.profileImage;

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
                  <AvatarImage src={currentProfileImage} alt={name} />
                  <AvatarFallback className="text-lg">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <Label htmlFor="profileImage" className="cursor-pointer bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary/90">
                    {isLoading ? t('uploading') || 'Uploading...' : t('change_picture')}
                  </Label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('saving') || 'Saving...' : t('save_changes')}
              </Button>
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
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {t('email_cannot_be_changed') || 'Email cannot be changed through this interface'}
                </p>
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
          {adminSettings && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t('manage_users')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('permission_to_manage_users')}
                  </p>
                </div>
                <Switch 
                  checked={adminSettings.permissions.manageUsers}
                  onCheckedChange={() => togglePermission('manageUsers')}
                  disabled={isLoading}
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
                  checked={adminSettings.permissions.manageContent}
                  onCheckedChange={() => togglePermission('manageContent')}
                  disabled={isLoading}
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
                  checked={adminSettings.permissions.manageSettings}
                  onCheckedChange={() => togglePermission('manageSettings')}
                  disabled={isLoading}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
