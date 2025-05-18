
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

// Form schema for doctor profile
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specialization: z.string().min(2, { message: "Specialization must be at least 2 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio cannot be more than 500 characters." }),
  years_of_experience: z.coerce.number().min(0, { message: "Years of experience cannot be negative." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const TherapistProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      specialization: '',
      bio: '',
      years_of_experience: 0,
    },
  });

  // Fetch doctor profile from Supabase
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching doctor profile:", error);
          
          // If no doctor profile exists, create one
          if (error.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('doctors')
              .insert({
                user_id: user.id,
                name: user.name || '',
                specialization: '',
                bio: '',
                years_of_experience: 0,
                patients_count: 0,
                profile_image: user.profileImage || '',
              });
              
            if (insertError) {
              console.error("Error creating doctor profile:", insertError);
              toast.error(t('error_creating_profile'));
            } else {
              // Fetch again after creating
              const { data: newProfileData } = await supabase
                .from('doctors')
                .select('*')
                .eq('user_id', user.id)
                .single();
                
              if (newProfileData) {
                setDoctorProfile(newProfileData);
                setProfileImage(newProfileData.profile_image);
                form.reset({
                  name: newProfileData.name || '',
                  specialization: newProfileData.specialization || '',
                  bio: newProfileData.bio || '',
                  years_of_experience: newProfileData.years_of_experience || 0,
                });
              }
            }
          } else {
            toast.error(t('error_loading_profile'));
          }
          
          return;
        }
        
        if (data) {
          setDoctorProfile(data);
          setProfileImage(data.profile_image);
          form.reset({
            name: data.name || '',
            specialization: data.specialization || '',
            bio: data.bio || '',
            years_of_experience: data.years_of_experience || 0,
          });
        }
      } catch (error) {
        console.error("Error in profile fetch:", error);
        toast.error(t('error_loading_profile'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user, t, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Generate a unique filename with user ID to ensure proper permissions
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload to Supabase storage with progress tracking
      const { error: uploadError } = await supabase.storage
        .from('doctor_profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
        
      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        toast.error(t('error_uploading_image'));
        return;
      }
      
      // Get the public URL 
      const { data: urlData } = supabase.storage
        .from('doctor_profiles')
        .getPublicUrl(fileName);
        
      if (urlData?.publicUrl) {
        setProfileImage(urlData.publicUrl);
        toast.success(t('image_uploaded_successfully'));
        
        // Immediately update the profile image in database
        const { error: updateError } = await supabase
          .from('doctors')
          .update({
            profile_image: urlData.publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
          
        if (updateError) {
          console.error("Error updating profile image:", updateError);
          toast.error(t('error_updating_profile_image'));
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(t('error_uploading_image'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Update the doctor profile in Supabase
      const { error } = await supabase
        .from('doctors')
        .update({
          name: values.name,
          specialization: values.specialization,
          bio: values.bio,
          years_of_experience: values.years_of_experience,
          profile_image: profileImage,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error updating doctor profile:", error);
        toast.error(t('error_updating_profile'));
        return;
      }
      
      toast.success(t('profile_updated'));
      
      // Also update auth metadata for consistency
      await supabase.auth.updateUser({
        data: {
          name: values.name,
          profile_image: profileImage
        }
      });
    } catch (error) {
      console.error("Error in profile update:", error);
      toast.error(t('error_updating_profile'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
                  <AvatarFallback className="text-xl">{form.watch("name").substring(0, 2).toUpperCase()}</AvatarFallback>
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
                      {new URL(profileImage).pathname.split('/').pop()}
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
