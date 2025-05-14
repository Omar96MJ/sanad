
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
import { Loader2 } from "lucide-react";

// Form schema for doctor profile
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specialization: z.string().min(2, { message: "Specialization must be at least 2 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio cannot be more than 500 characters." }),
  years_of_experience: z.coerce.number().min(0, { message: "Years of experience cannot be negative." }),
  profile_image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const TherapistProfile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      specialization: '',
      bio: '',
      years_of_experience: 0,
      profile_image: '',
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
          toast.error(t('error_loading_profile'));
          return;
        }
        
        if (data) {
          setDoctorProfile(data);
          form.reset({
            name: data.name || '',
            specialization: data.specialization || '',
            bio: data.bio || '',
            years_of_experience: data.years_of_experience || 0,
            profile_image: data.profile_image || '',
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
          profile_image: values.profile_image,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error updating doctor profile:", error);
        toast.error(t('error_updating_profile'));
        return;
      }
      
      toast.success(t('profile_updated'));
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
                  <AvatarImage src={form.watch("profile_image") || "/placeholder.svg"} alt={form.watch("name")} />
                  <AvatarFallback className="text-xl">{form.watch("name").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <FormField
                  control={form.control}
                  name="profile_image"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t('profile_image_url')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <Button type="submit" disabled={isSaving}>
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
