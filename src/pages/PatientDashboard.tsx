
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/lib/types";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/types";
import { DoctorCard } from "@/components/UserCard";
import { toast } from "sonner";
import MessagingLayout from "@/components/messaging/MessagingLayout";

const mockDoctor: Doctor = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'doctor@example.com',
  role: 'doctor',
  profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
  specialization: 'Clinical Psychologist',
  bio: 'Specializing in anxiety disorders and cognitive behavioral therapy with over 10 years of experience.',
  patients: 42,
  yearsOfExperience: 10
};

const mockAppointments = [
  {
    id: 1,
    date: '2023-11-10T13:00:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'Video Call',
    status: 'upcoming'
  },
  {
    id: 2,
    date: '2023-10-25T10:30:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'In-Person',
    status: 'completed'
  },
  {
    id: 3,
    date: '2023-10-10T14:45:00',
    doctor: 'Dr. Sarah Johnson',
    type: 'Video Call',
    status: 'completed'
  }
];

const mockArticles: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: Causes, Symptoms, and Treatments',
    excerpt: 'Anxiety disorders are the most common mental health concern in the United States. Learn about the causes, symptoms, and effective treatments.',
    content: '',
    author: 'Dr. Sarah Johnson',
    authorId: '1',
    authorRole: 'doctor',
    publishedDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9',
    tags: ['Anxiety', 'Mental Health', 'Therapy']
  },
  {
    id: '2',
    title: 'The Power of Mindfulness in Daily Life',
    excerpt: 'Discover how practicing mindfulness can reduce stress, improve focus, and enhance your overall mental wellbeing.',
    content: '',
    author: 'Dr. Michael Lee',
    authorId: '3',
    authorRole: 'doctor',
    publishedDate: '2023-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Mindfulness', 'Meditation', 'Stress Management']
  }
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(65);
  const [isVisible, setIsVisible] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate data loading
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  } else if (user.role !== 'patient') {
    return <Navigate to="/" />;
  }

  const handleBookAppointment = () => {
    toast.success(isRTL ? "سيتم إضافة ميزة حجز المواعيد قريبًا!" : "Appointment booking feature coming soon!");
  };

  const handleStartTherapy = () => {
    toast.success(isRTL ? "سيتم إضافة ميزة جلسة العلاج عبر الإنترنت قريبًا!" : "Online therapy session feature coming soon!");
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 pb-16">
        <div className="bg-muted/30 py-12">
          <div className="container-custom">
            <div 
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="text-3xl font-bold mb-2">{t('welcome_back')}, {user.name}</h1>
              <p className="text-muted-foreground">
                {t('track_your_progress')}
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom mt-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="appointments">{t('sessions')}</TabsTrigger>
              <TabsTrigger value="resources">{t('resources')}</TabsTrigger>
              <TabsTrigger value="messaging">{t('messaging')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card 
                  className={`md:col-span-2 card-hover border border-border/50 transition-all duration-700 delay-100 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{t('your_progress')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t('therapy_program')}</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-accent rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">{t('completed_sessions')}</div>
                          <div className="text-2xl font-bold">7 {t('of')} 12</div>
                          <div className="text-xs text-muted-foreground mt-1">{t('next_session')}: {isRTL ? '١٠ نوفمبر' : 'Nov 10'}</div>
                        </div>
                        <div className="bg-accent rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">{t('mood_tracker')}</div>
                          <div className="text-2xl font-bold">{t('improving')}</div>
                          <div className="text-xs text-muted-foreground mt-1">12% {t('up_this_month')}</div>
                        </div>
                        <div className="bg-accent rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">{t('weekly_goals')}</div>
                          <div className="text-2xl font-bold">3 {t('of')} 5</div>
                          <div className="text-xs text-muted-foreground mt-1">2 {t('days_remaining')}</div>
                        </div>
                        <div className="bg-accent rounded-lg p-4">
                          <div className="text-sm font-medium mb-1">{t('exercises_completed')}</div>
                          <div className="text-2xl font-bold">12</div>
                          <div className="text-xs text-muted-foreground mt-1">+3 {t('from_last_week')}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Button onClick={handleStartTherapy} className="btn-primary">
                          {t('start_todays_session')}
                        </Button>
                        <Button variant="outline" className="rounded-full">
                          {t('view_detailed_progress')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`border border-border/50 card-hover transition-all duration-700 delay-200 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{t('your_therapist')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DoctorCard doctor={mockDoctor} />
                    <Button 
                      onClick={handleBookAppointment} 
                      className="w-full mt-6 btn-primary"
                    >
                      {t('schedule_session')}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card 
                  className={`border border-border/50 card-hover transition-all duration-700 delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{t('calendar')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      locale={isRTL ? 'ar-SA' : 'en-US'}
                    />
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">{t('upcoming')}</h4>
                      {mockAppointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
                        mockAppointments
                          .filter(apt => apt.status === 'upcoming')
                          .slice(0, 1)
                          .map(apt => (
                            <div key={apt.id} className="bg-primary/10 p-3 rounded-lg">
                              <p className="font-medium text-sm">{formatAppointmentDate(apt.date)}</p>
                              <p className="text-xs text-muted-foreground">{formatAppointmentTime(apt.date)} • {isRTL ? (apt.type === 'Video Call' ? 'مكالمة فيديو' : 'شخصيًا') : apt.type}</p>
                              <p className="text-xs mt-1">{apt.doctor}</p>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-muted-foreground">{t('no_upcoming_sessions')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`md:col-span-2 border border-border/50 card-hover transition-all duration-700 delay-400 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{t('recommended_articles')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {mockArticles.map(article => (
                        <BlogCard key={article.id} blog={article} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-6">
              <Card className="border border-border/50">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>{t('your_appointments')}</CardTitle>
                    <Button onClick={handleBookAppointment} className="btn-primary">
                      {t('schedule_new_session')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">{t('upcoming')}</h3>
                      {mockAppointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
                        <div className="space-y-3">
                          {mockAppointments
                            .filter(apt => apt.status === 'upcoming')
                            .map(apt => (
                              <div 
                                key={apt.id} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-lg p-4"
                              >
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                                      {isRTL ? (apt.type === 'Video Call' ? 'مكالمة فيديو' : 'شخصيًا') : apt.type}
                                    </div>
                                    <Badge variant="outline">{t(apt.status)}</Badge>
                                  </div>
                                  <p className="font-medium">{formatAppointmentDate(apt.date)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatAppointmentTime(apt.date)} {isRTL ? 'مع' : 'with'} {apt.doctor}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="rounded-full">
                                    {t('reschedule')}
                                  </Button>
                                  <Button variant="destructive" size="sm" className="rounded-full">
                                    {t('cancel')}
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">{t('no_upcoming_sessions')}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">{t('past_appointments')}</h3>
                      <div className="space-y-3">
                        {mockAppointments
                          .filter(apt => apt.status === 'completed')
                          .map(apt => (
                            <div 
                              key={apt.id} 
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-lg p-4"
                            >
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-medium">
                                    {isRTL ? (apt.type === 'Video Call' ? 'مكالمة فيديو' : 'شخصيًا') : apt.type}
                                  </div>
                                  <Badge variant="outline" className="bg-muted">{t('completed')}</Badge>
                                </div>
                                <p className="font-medium">{formatAppointmentDate(apt.date)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatAppointmentTime(apt.date)} {isRTL ? 'مع' : 'with'} {apt.doctor}
                                </p>
                              </div>
                              <div>
                                <Button variant="outline" size="sm" className="rounded-full">
                                  {t('view_notes')}
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-8">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>{t('mental_health_resources')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-accent rounded-lg p-6 hover:shadow-md transition-all">
                      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 6.25278V19.2528M18.5 12.7528H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t('emergency_help')}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('access_immediate_support')}
                      </p>
                      <a href="#" className="text-sm font-medium text-primary hover:underline">
                        {t('view_resources')} →
                      </a>
                    </div>
                    
                    <div className="bg-accent rounded-lg p-6 hover:shadow-md transition-all">
                      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                          <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                          <path d="M9 9H9.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                          <path d="M15 9H15.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t('self_help_tools')}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('explore_exercises')}
                      </p>
                      <a href="#" className="text-sm font-medium text-primary hover:underline">
                        {t('access_tools')} →
                      </a>
                    </div>
                    
                    <div className="bg-accent rounded-lg p-6 hover:shadow-md transition-all">
                      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                          <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t('educational_material')}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('learn_about_mental_health')}
                      </p>
                      <a href="#" className="text-sm font-medium text-primary hover:underline">
                        {t('start_learning')} →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle>{t('recommended_articles')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockArticles.map(article => (
                      <BlogCard key={article.id} blog={article} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="messaging" className="space-y-6">
              <div className="mt-4">
                <MessagingLayout isTherapist={false} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
