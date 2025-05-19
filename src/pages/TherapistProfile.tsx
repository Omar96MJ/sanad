
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Users, Clock, GraduationCap, Calendar as CalendarIcon, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [therapist, setTherapist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const isRTL = language === 'ar';
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!id) return;
    
    const fetchTherapist = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setTherapist({
            id: data.id,
            name: data.name || 'Unknown Therapist',
            emailAddress: data.user_id || 'therapist@example.com',
            role: 'doctor',
            profileImage: data.profile_image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
            specialization: data.specialization || 'Clinical Psychologist',
            bio: data.bio || 'Experienced therapist specializing in various mental health conditions.',
            patients: data.patients_count || 0,
            yearsOfExperience: data.years_of_experience || 0,
            education: [
              { degree: 'Ph.D. in Clinical Psychology', institution: 'Stanford University', year: '2012' },
              { degree: 'M.S. in Psychology', institution: 'Columbia University', year: '2009' }
            ],
            availableDays: ['monday', 'tuesday', 'wednesday', 'thursday'],
            reviews: [
              {
                id: '1', 
                patientName: 'Sarah M.', 
                rating: 5,
                comment: 'Very empathetic and insightful. I\'ve made great progress working with them.',
                date: '2023-09-15'
              },
              {
                id: '2', 
                patientName: 'James K.', 
                rating: 4,
                comment: 'Helpful techniques for managing anxiety. Would recommend.',
                date: '2023-08-20'
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching therapist:', error);
        toast.error(t('error_loading_therapist_details'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTherapist();
  }, [id, t]);

  const handleSelectTherapist = async () => {
    if (!user || !therapist) return;
    
    setIsSelecting(true);
    try {
      // For now we'll simulate a creation of a relationship
      // In a real app, this would create a record in the DB
      // Check if relationship already exists
      const { data, error } = await supabase
        .from('doctors_patients')
        .insert({
          doctor_id: therapist.id,
          patient_id: user.id
        });
        
      if (error && error.code !== '23505') { // Ignore duplicate key errors
        throw error;
      }
      
      toast.success(t('therapist_selected_successfully'));
      // Wait a moment then redirect to dashboard
      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 1500);
    } catch (error) {
      console.error('Error selecting therapist:', error);
      toast.error(t('error_selecting_therapist'));
    } finally {
      setIsSelecting(false);
    }
  };
  
  const handleBookAppointment = () => {
    navigate(`/session-booking?therapist=${therapist.id}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-muted-foreground">{t('loading')}...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!therapist) {
    return (
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">{t('therapist_not_found')}</h1>
            <Button onClick={() => navigate(-1)}>{t('back')}</Button>
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
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4"
          >
            ← {t('back')}
          </Button>
          
          {/* Therapist Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-32 h-32 border-2 border-primary/20">
              <AvatarImage src={therapist.profileImage} alt={therapist.name} />
              <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl font-bold">{therapist.name}</h1>
                  <p className="text-lg text-muted-foreground">{therapist.specialization}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBookAppointment}>
                    {t('book_appointment')}
                  </Button>
                  
                  {user && user.role === 'patient' && (
                    <Button 
                      onClick={handleSelectTherapist} 
                      disabled={isSelecting}
                    >
                      {isSelecting ? t('selecting_therapist') : t('select_as_my_therapist')}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 my-4">
                <div className="flex items-center gap-2">
                  <Users className="text-primary h-5 w-5" />
                  <span>
                    <strong>{therapist.patients}</strong> {t('patients')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-primary h-5 w-5" />
                  <span>
                    <strong>{therapist.yearsOfExperience}</strong> {t('years')}
                  </span>
                </div>
                <Badge>{t('available')}</Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Therapist Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid grid-cols-3 w-full md:w-1/2 lg:w-1/3 mb-8">
            <TabsTrigger value="about">{t('about')}</TabsTrigger>
            <TabsTrigger value="schedule">{t('schedule')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('reviews')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-6">
            {/* Bio */}
            <div>
              <h2 className="text-xl font-semibold mb-3">{t('bio')}</h2>
              <p className="text-muted-foreground">{therapist.bio}</p>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-3">{t('contact_information')}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{therapist.emailAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            
            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold mb-3">{t('education')}</h2>
              <div className="space-y-3">
                {therapist.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}, {edu.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <h2 className="text-xl font-semibold mb-4">{t('availability')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Available Days */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">{t('view_available_slots')}</h3>
                  <div className="space-y-2">
                    {therapist.availableDays.map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>{t(day)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Calendar */}
              <Card>
                <CardContent className="pt-6 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Button onClick={handleBookAppointment} className="w-full md:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {t('book_appointment')}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <h2 className="text-xl font-semibold mb-2">{t('patient_reviews')}</h2>
            <p className="text-muted-foreground mb-6">{t('what_patients_say')}</p>
            
            <div className="space-y-4">
              {therapist.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{review.patientName}</h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        1 {t('month_ago')}
                      </span>
                    </div>
                    <p className="mt-3 text-muted-foreground">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistProfile;
