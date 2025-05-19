import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Doctor } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Star, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchTherapistDetails();
  }, [id, user, navigate]);

  const fetchTherapistDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the database
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error(t('therapist_not_found'));
          navigate('/therapist-search');
          return;
        }
        throw error;
      }

      const formattedTherapist: Doctor = {
        id: data.id,
        name: data.name,
        email: data.email || 'doctor@example.com',
        role: 'doctor',
        specialization: data.specialization || 'Clinical Psychologist',
        bio: data.bio || 'Experienced therapist specializing in various mental health conditions.',
        patients: data.patients_count || 0,
        yearsOfExperience: data.years_of_experience || 0,
        profileImage: data.profile_image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      };

      setTherapist(formattedTherapist);
    } catch (error) {
      console.error('Error fetching therapist details:', error);
      toast.error(t('error_loading_therapist_details'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTherapist = async () => {
    if (!user || !therapist) return;
    
    setIsSelecting(true);
    try {
      // In a real app, this would update in the database
      const { error } = await supabase
        .from('patient_therapist_relationships')
        .upsert({
          patient_id: user?.id,
          therapist_id: therapist.id,
          assigned_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(t('therapist_selected_successfully'));
      navigate('/patient-dashboard');
    } catch (error) {
      console.error('Error selecting therapist:', error);
      toast.error(t('error_selecting_therapist'));
    } finally {
      setIsSelecting(false);
    }
  };

  const handleBookAppointment = () => {
    if (!therapist) return;
    // Store selected therapist ID in localStorage or state
    localStorage.setItem('selectedTherapistId', therapist.id);
    navigate('/session-booking');
  };

  if (isLoading || !therapist) {
    return (
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-muted h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={therapist.profileImage} alt={therapist.name} />
                    <AvatarFallback>{therapist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">{therapist.name}</h2>
                  <p className="text-muted-foreground mb-2">{therapist.specialization}</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground">(24 {t('reviews')})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col items-center p-2 border rounded-md">
                      <Users className="h-5 w-5 mb-1 text-muted-foreground" />
                      <span className="font-bold">{therapist.patients}</span>
                      <span className="text-xs text-muted-foreground">{t('patients')}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 border rounded-md">
                      <Calendar className="h-5 w-5 mb-1 text-muted-foreground" />
                      <span className="font-bold">{therapist.yearsOfExperience}</span>
                      <span className="text-xs text-muted-foreground">{t('years')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full" onClick={handleSelectTherapist} disabled={isSelecting}>
                  {isSelecting ? t('selecting_therapist') : t('select_as_my_therapist')}
                </Button>
                <Button className="w-full" variant="outline" onClick={handleBookAppointment}>
                  {t('book_appointment')}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('contact_information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{t('available')} Mon-Fri</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>9:00 AM - 5:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about">{t('about')}</TabsTrigger>
                <TabsTrigger value="schedule">{t('schedule')}</TabsTrigger>
                <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('about')}</CardTitle>
                    <CardDescription>{t('professional_experience')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">{t('specialization')}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Anxiety</Badge>
                          <Badge variant="outline">Depression</Badge>
                          <Badge variant="outline">Trauma</Badge>
                          <Badge variant="outline">Stress Management</Badge>
                          <Badge variant="outline">Relationship Issues</Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">{t('bio')}</h3>
                        <p>{therapist.bio}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">{t('education')}</h3>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Ph.D. in Clinical Psychology, University of Chicago</li>
                          <li>M.A. in Psychology, Stanford University</li>
                          <li>B.S. in Psychology, University of California, Berkeley</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('availability')}</CardTitle>
                    <CardDescription>{t('view_available_slots')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                        <div key={day} className="border rounded-md p-4">
                          <h3 className="font-medium mb-2">{t(day.toLowerCase())}</h3>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full">
                              9:00 AM
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              11:00 AM
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              2:00 PM
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              4:00 PM
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={handleBookAppointment}
                    >
                      {t('book_appointment')} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('patient_reviews')}</CardTitle>
                    <CardDescription>{t('what_patients_say')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">1 {t('month_ago')}</span>
                          </div>
                          <p className="text-sm font-medium mb-1">Anonymous Patient</p>
                          <p className="text-sm text-muted-foreground">
                            Dr. {therapist.name} was very professional and helpful. I felt comfortable 
                            sharing my concerns and received practical advice that has improved my daily life.
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistProfile;
