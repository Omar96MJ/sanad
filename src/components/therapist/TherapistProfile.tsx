import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { DoctorProfile as DoctorProfileType} from "@/lib/therapist-types";

// Form schema for doctor profile
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specialization: z.string().min(2, { message: "Specialization must be at least 2 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio cannot be more than 500 characters." }),
  years_of_experience: z.coerce.number().min(0, { message: "Years of experience cannot be negative." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface TherapistProfileProps {
  initialDoctorProfile: DoctorProfileType | null;
  onProfileUpdate?: () => void; // دالة اختيارية يتم استدعاؤها بعد تحديث ناجح للملف الشخصي (لإعادة جلب البيانات في الأب)
}

const TherapistProfile = ({ initialDoctorProfile, onProfileUpdate }: TherapistProfileProps) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { // القيم الافتراضية ستأتي من initialDoctorProfile
      name: initialDoctorProfile?.name || '',
      specialization: initialDoctorProfile?.specialization || '',
      bio: initialDoctorProfile?.bio || '',
      years_of_experience: initialDoctorProfile?.years_of_experience || 0,
      // weekly_available_hours: initialDoctorProfile?.weekly_available_hours || 0, // إذا كان جزءًا من النموذج
    },
  });

  // useEffect لتحديث النموذج والصورة إذا تغيرت initialDoctorProfile من الأعلى
  useEffect(() => {
    if (initialDoctorProfile) {
      form.reset({
        name: initialDoctorProfile.name || '',
        specialization: initialDoctorProfile.specialization || '',
        bio: initialDoctorProfile.bio || '',
        years_of_experience: initialDoctorProfile.years_of_experience || 0,
        // weekly_available_hours: initialDoctorProfile.weekly_available_hours || 0,
      });
      setProfileImage(initialDoctorProfile.profile_image || null);
    } else {
      // التعامل مع حالة عدم وجود ملف شخصي (مثلاً، تعيين قيم فارغة للنموذج)
      form.reset({
        name: user?.name || '', // يمكن استخدام اسم المستخدم من Auth كقيمة أولية إذا لم يوجد ملف
        specialization: '',
        bio: '',
        years_of_experience: 0,
        // weekly_available_hours: 0,
      });
      setProfileImage(user?.profileImage || null); // يمكن استخدام صورة المستخدم من Auth
    }
  }, [initialDoctorProfile, form, user]); // أضف user إذا كنت تستخدمه في القيم الافتراضية


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !initialDoctorProfile) { // نحتاج initialDoctorProfile.id للتحديث أو user.id
        toast.error(t('error_user_or_profile_not_found'));
        return;
    };
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Generate a unique filename with user ID to ensure proper permissions
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload to Supabase storage without using onUploadProgress
      // This is compatible with the FileOptions type
        const { error: uploadError } = await supabase.storage
        .from('doctor-profile-images') // تأكد من أن هذا هو اسم الـ bucket الصحيح
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false // أو true إذا كنت تريد الكتابة فوق الملفات بنفس الاسم
        });
        
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error(t('error_uploading_image') + `: ${uploadError.message}`);
        return;
      }
      
      // Set progress to 100% after successful upload
      setUploadProgress(100);
      
      // Get the public URL 
      const { data: urlData } = supabase.storage
        .from('doctor-profile-images')
        .getPublicUrl(fileName);
        
      if (urlData?.publicUrl) {
        setProfileImage(urlData.publicUrl);
        toast.success(t('image_uploaded_successfully'));
        
        // Immediately update the profile image in database
        const { error: updateError } = await supabase
          .from('doctors')
          .update({ profile_image: urlData.publicUrl }) 
          .eq('id', initialDoctorProfile.id); // استخدام id الطبيب من initialDoctorProfile
          
        if (updateError) {
          console.error("Error updating profile image in DB:", updateError);
          toast.error(t('error_updating_profile_image_db'));
        }else {
            onProfileUpdate?.(); // إعلام المكون الأب بأن هناك تحديثًا
        }
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(t('error_uploading_image')  + `: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Keep progress at 100% for a short time before resetting
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user || !initialDoctorProfile) {
      toast.error(t('profile_data_not_loaded_cannot_save'));
      return;
    }
    
     try {
      setIsSaving(true);
      const updates = {
        ...values,
        profile_image: profileImage,
        // updated_at: new Date().toISOString(), // تمت الإزالة، قاعدة البيانات ستتولى ذلك
      };

      // Update the doctor profile in Supabase
     const { error } = await supabase
        .from('doctors')
        .update(updates)
        .eq('id', initialDoctorProfile.id); // استخدام id الطبيب من initialDoctorProfile
  
       if (error) {
        console.error("Error updating doctor profile:", error);
        toast.error(t('error_updating_profile') + `: ${error.message}`);
        return;
      }
      
      toast.success(t('profile_updated_successfully'));
      
      // Also update auth metadata for consistency
      if (values.name !== initialDoctorProfile.name || profileImage !== initialDoctorProfile.profile_image) {
        await supabase.auth.updateUser({
          data: {
            name: values.name,
            profile_image: profileImage // تأكد من أن metadata في auth تدعم هذا
          }
        });
      }
      onProfileUpdate?.(); // إعلام المكون الأب بأن هناك تحديثًا
    } catch (error: any) {
      console.error("Error in profile update submit:", error);
      toast.error(t('error_updating_profile') + `: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // حالة التحميل الرئيسية الآن تعتمد على المكون الأب
  // إذا كان initialDoctorProfile هو null ولم يكن هناك مستخدم (أثناء التحميل الأولي للتطبيق)
  if (!user && !initialDoctorProfile) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (user && !initialDoctorProfile) {
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('doctor_profile')}</CardTitle>
        <CardDescription>{t('manage_your_profile_information')}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profileImage || "/placeholder.svg"} alt={form.watch("name")} />
                  <AvatarFallback className="text-xl">
                    {(form.watch("name") || user?.name || "Dr").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="w-full">
                  <FormLabel>{t('profile_image')}</FormLabel>
                  <div className="mt-2">
                    <label 
                      htmlFor="profile-image" 
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 transition-colors hover:bg-muted"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {isUploading ? t('uploading') : t('upload_image')}
                      </span>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  
                  {isUploading && (
                    <div className="mt-2">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                  
                  {profileImage && !isUploading && (
                    <p className="mt-2 text-xs text-muted-foreground truncate">
                      {new URL(profileImage).pathname.split('/').pop() || t('image_uploaded')}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('full_name')}</FormLabel>
                      <FormControl>
                        <Input {...field} className={isRTL ? 'text-right' : 'text-left'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('specialization')}</FormLabel>
                      <FormControl>
                        <Input {...field} className={isRTL ? 'text-right' : 'text-left'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="years_of_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('years_of_experience')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          className={isRTL ? 'text-right' : 'text-left'} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('professional_bio')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5}
                          {...field} 
                          className={isRTL ? 'text-right' : 'text-left'} 
                        />
                      </FormControl>
                      <FormDescription>
                        {t('bio_description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving || isUploading}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : (
                  t('save_changes')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TherapistProfile;
