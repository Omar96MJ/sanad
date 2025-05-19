
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

// Form schema for therapist registration
const registrationFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  specialization: z.string().min(2, { message: "Specialization must be at least 2 characters." }),
  yearsOfExperience: z.coerce.number().min(0, { message: "Years of experience cannot be negative." }),
  education: z.string().min(2, { message: "Education details are required." }),
  certifications: z.string().optional(),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters." }).max(500, { message: "Bio cannot be more than 500 characters." }),
  agree: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." })
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const TherapistRegistrationForm = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      specialization: "",
      yearsOfExperience: 0,
      education: "",
      certifications: "",
      bio: "",
      agree: false,
    },
  });
  
  const onSubmit = async (values: RegistrationFormValues) => {
    if (!resumeFile || !licenseFile) {
      toast.error(t('please_upload_all_required_documents'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would be an API call to submit the registration form
      // with both the form values and the uploaded files
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t('registration_submitted'));
      navigate('/therapist-dashboard');
    } catch (error) {
      console.error('Registration submission error:', error);
      toast.error(t('registration_error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'resume' | 'license') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (fileType === 'resume') {
      setResumeFile(file);
    } else {
      setLicenseFile(file);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('registration_form')}</CardTitle>
        <CardDescription>{t('complete_registration')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className={isRTL ? 'text-right' : 'text-left'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone')}</FormLabel>
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
                name="yearsOfExperience"
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
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('education')}</FormLabel>
                    <FormControl>
                      <Input {...field} className={isRTL ? 'text-right' : 'text-left'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('certifications')}</FormLabel>
                  <FormControl>
                    <Input {...field} className={isRTL ? 'text-right' : 'text-left'} />
                  </FormControl>
                  <FormDescription>
                    {t('certifications_description')}
                  </FormDescription>
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
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">{t('resume')}</h3>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="resume-upload"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 transition-colors hover:bg-muted"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">{resumeFile ? resumeFile.name : t('upload_resume')}</span>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'resume')}
                    />
                  </label>
                  {resumeFile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setResumeFile(null)}
                    >
                      {t('remove')}
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">{t('license')}</h3>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="license-upload"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-4 transition-colors hover:bg-muted"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">{licenseFile ? licenseFile.name : t('upload_license')}</span>
                    <input
                      id="license-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'license')}
                    />
                  </label>
                  {licenseFile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setLicenseFile(null)}
                    >
                      {t('remove')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="agree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t('agree_terms')}
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  t('submit_registration')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TherapistRegistrationForm;
