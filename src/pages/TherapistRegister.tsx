
import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Upload } from "lucide-react";
import { toast } from "sonner";

const TherapistRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isLoading, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const isRTL = language === 'ar';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Currently we just register the user as a doctor
      await register(name, email, password, 'doctor');
      
      // Note: In a real implementation, we would upload CV and certifications to storage
      // and store specialization, bio, and years of experience in a doctor profile table
      toast.success(t('therapist_registration_success'));
      
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertifications(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8 fade-in">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">{t('therapist_register')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('therapist_register_subtitle')}
            </p>
          </div>
          
          <div className="mt-8 bg-card border border-border/50 rounded-lg p-6 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('basic_information')}</h3>
                
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
              </div>

              {/* Professional Information */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-lg font-medium">{t('professional_information')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">{t('specialization')}</Label>
                  <Input 
                    id="specialization" 
                    name="specialization" 
                    type="text" 
                    required 
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder={t('specialization_placeholder')}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">{t('years_of_experience')}</Label>
                  <Input 
                    id="yearsExperience" 
                    name="yearsExperience" 
                    type="number" 
                    required 
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder={t('years_of_experience_placeholder')}
                    className={isRTL ? 'text-right' : 'text-left'}
                    min="0"
                    max="70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('professional_bio')}</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    required 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t('professional_bio_placeholder')}
                    className={isRTL ? 'text-right' : 'text-left'}
                    rows={4}
                  />
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-lg font-medium">{t('documents')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="cv">{t('cv_resume')}</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="cv" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          {cvFile ? cvFile.name : t('cv_upload_instructions')}
                        </p>
                        <p className="text-xs text-gray-500">{t('cv_file_formats')}</p>
                      </div>
                      <input id="cv" type="file" className="hidden" onChange={handleCvFileChange} required />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">{t('certifications')}</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="certifications" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          {certifications.length > 0 
                            ? `${certifications.length} ${t('files_selected')}` 
                            : t('certifications_upload_instructions')}
                        </p>
                        <p className="text-xs text-gray-500">{t('certification_file_formats')}</p>
                      </div>
                      <input id="certifications" type="file" className="hidden" onChange={handleCertificationsChange} multiple required />
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary" 
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? t('submitting') : t('submit_application')}
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
            <p className="text-sm text-muted-foreground mt-2">
              {t('looking_for_patient_account')}{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                {t('register_as_patient')}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistRegister;
