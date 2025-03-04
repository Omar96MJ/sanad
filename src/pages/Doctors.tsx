
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DoctorType {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  languages: string[];
  image: string;
  availability: string[];
}

const Doctors = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      date: "",
      time: "",
      message: "",
    },
  });

  const doctors: DoctorType[] = [
    {
      id: "1",
      name: language === 'ar' ? "د. سارة أحمد" : "Dr. Sarah Ahmed",
      specialty: language === 'ar' ? "طبيب نفسي" : "Psychiatrist",
      bio: language === 'ar' 
        ? "د. سارة أحمد هي طبيبة نفسية مرخصة مع أكثر من 10 سنوات من الخبرة في علاج الاكتئاب والقلق واضطرابات ما بعد الصدمة." 
        : "Dr. Sarah Ahmed is a licensed psychiatrist with over 10 years of experience treating depression, anxiety, and PTSD.",
      languages: language === 'ar' ? ["العربية", "الإنجليزية"] : ["Arabic", "English"],
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      availability: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    },
    {
      id: "2",
      name: language === 'ar' ? "د. محمد الحسن" : "Dr. Mohammed Al-Hassan",
      specialty: language === 'ar' ? "معالج نفسي" : "Psychotherapist",
      bio: language === 'ar'
        ? "د. محمد متخصص في العلاج السلوكي المعرفي ويساعد مرضاه في التغلب على تحديات الصحة العقلية وتطوير آليات تكيف صحية."
        : "Dr. Mohammed specializes in cognitive behavioral therapy and helps his patients overcome mental health challenges and develop healthy coping mechanisms.",
      languages: language === 'ar' ? ["العربية"] : ["Arabic"],
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      availability: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
    },
    {
      id: "3",
      name: language === 'ar' ? "د. ليلى المهيري" : "Dr. Layla Al-Muhiri",
      specialty: language === 'ar' ? "أخصائية علم النفس السريري" : "Clinical Psychologist",
      bio: language === 'ar'
        ? "د. ليلى متخصصة في مساعدة المراهقين والبالغين الذين يعانون من اضطرابات الأكل واضطرابات القلق والاكتئاب."
        : "Dr. Layla specializes in helping teenagers and adults dealing with eating disorders, anxiety disorders, and depression.",
      languages: language === 'ar' ? ["العربية", "الإنجليزية", "الفرنسية"] : ["Arabic", "English", "French"],
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      availability: ["9:30 AM", "11:30 AM", "2:30 PM", "4:30 PM"],
    },
    {
      id: "4",
      name: language === 'ar' ? "د. فيصل العلوي" : "Dr. Faisal Al-Alawi",
      specialty: language === 'ar' ? "مستشار نفسي" : "Psychological Counselor",
      bio: language === 'ar'
        ? "د. فيصل يتمتع بخبرة واسعة في تقديم المشورة للأزواج والعائلات ومساعدتهم في تحسين علاقاتهم والتغلب على التحديات."
        : "Dr. Faisal has extensive experience in counseling couples and families, helping them improve their relationships and overcome challenges.",
      languages: language === 'ar' ? ["العربية", "الإنجليزية"] : ["Arabic", "English"],
      image: "https://randomuser.me/api/portraits/men/53.jpg",
      availability: ["8:00 AM", "10:00 AM", "12:00 PM", "3:00 PM"],
    },
  ];

  const onSubmit = (data) => {
    toast({
      title: t('appointment_booked'),
      description: t('appointment_confirmation'),
    });
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 container-custom py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('our_doctors')}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('doctors_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>{doctor.specialty}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{doctor.bio}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {doctor.languages.map((lang) => (
                    <span key={lang} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setSelectedTime("");
                      }}
                    >
                      {t('book_appointment')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{t('book_with')} {doctor.name}</DialogTitle>
                      <DialogDescription>
                        {t('select_date_time')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <h4 className="font-medium mb-2">{t('available_times')}</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {selectedDoctor?.availability.map((time) => (
                          <Button 
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('your_name')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('your_email')}</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('your_phone')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('consultation_reason')}</FormLabel>
                                <FormControl>
                                  <Textarea className="min-h-[80px]" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">{t('confirm_booking')}</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
