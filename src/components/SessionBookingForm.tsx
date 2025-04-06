
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarIcon, Clock, Users, Calendar as CalendarCheck } from "lucide-react";
import { TherapistProfile } from "@/lib/therapist-types";

// Mock therapist data
const mockTherapists: TherapistProfile[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    role: "doctor",
    specialization: "Cognitive Behavioral Therapy",
    bio: "Specializing in anxiety and depression treatment with 8+ years of experience",
    patients: 24,
    yearsOfExperience: 8,
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael@example.com",
    role: "doctor",
    specialization: "Family Therapy",
    bio: "Helping families build stronger relationships for over 10 years",
    patients: 18,
    yearsOfExperience: 10,
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "3",
    name: "Dr. Aisha Rahman",
    email: "aisha@example.com",
    role: "doctor",
    specialization: "Trauma Therapy",
    bio: "Specialized in PTSD and trauma recovery with a compassionate approach",
    patients: 15,
    yearsOfExperience: 7,
    profileImage: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256"
  },
];

// Available time slots
const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

// Session types
const sessionTypes = [
  { value: "initial", label: { en: "Initial Consultation (60 min)", ar: "جلسة استشارية أولى (60 دقيقة)" } },
  { value: "followup", label: { en: "Follow-up Session (45 min)", ar: "جلسة متابعة (45 دقيقة)" } },
  { value: "emergency", label: { en: "Emergency Session (30 min)", ar: "جلسة طارئة (30 دقيقة)" } },
];

const SessionBookingForm = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === "ar";

  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBookSession = () => {
    if (!selectedTherapist || !selectedDate || !selectedTime || !sessionType) {
      toast.error(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        isRTL 
          ? "تم حجز جلستك بنجاح! سنرسل لك تأكيدًا عبر البريد الإلكتروني." 
          : "Your session has been booked successfully! We'll send you a confirmation email."
      );
      setLoading(false);
      
      // Reset form
      setSelectedTherapist("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setSessionType("");
      setNotes("");
    }, 1500);
  };

  const disablePastDates = (date: Date) => {
    return isBefore(date, new Date()) && !isSameDay(date, new Date());
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          {isRTL ? "حجز جلسة جديدة" : "Schedule a New Session"}
        </CardTitle>
        <CardDescription>
          {isRTL 
            ? "اختر المعالج والتاريخ والوقت المناسب لك"
            : "Select your preferred therapist, date, and time"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="therapist">{isRTL ? "المعالج" : "Therapist"}</Label>
          <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
            <SelectTrigger id="therapist" className="w-full">
              <SelectValue placeholder={isRTL ? "اختر معالج" : "Select a therapist"} />
            </SelectTrigger>
            <SelectContent>
              {mockTherapists.map((therapist) => (
                <SelectItem key={therapist.id} value={therapist.id} className="flex items-center">
                  {therapist.name} - {therapist.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTherapist && (
            <div className="mt-4 p-4 bg-muted/40 rounded-lg">
              {mockTherapists.filter(t => t.id === selectedTherapist).map((therapist) => (
                <div key={therapist.id} className="flex gap-4 items-start">
                  <img 
                    src={therapist.profileImage} 
                    alt={therapist.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{therapist.name}</h3>
                    <p className="text-sm text-muted-foreground">{therapist.specialization}</p>
                    <p className="text-sm mt-1">{therapist.bio}</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {therapist.patients} {isRTL ? "مريض" : "patients"}
                      </span>
                      <span>
                        {therapist.yearsOfExperience} {isRTL ? "سنوات خبرة" : "years of experience"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="session-type">{isRTL ? "نوع الجلسة" : "Session Type"}</Label>
          <Select value={sessionType} onValueChange={setSessionType}>
            <SelectTrigger id="session-type">
              <SelectValue placeholder={isRTL ? "اختر نوع الجلسة" : "Select session type"} />
            </SelectTrigger>
            <SelectContent>
              {sessionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {isRTL ? type.label.ar : type.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{isRTL ? "التاريخ" : "Date"}</Label>
          <div className="border rounded-md p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto rounded-md border pointer-events-auto"
              disabled={disablePastDates}
              initialFocus
            />
          </div>
        </div>

        {selectedDate && (
          <div className="space-y-2">
            <Label htmlFor="time">{isRTL ? "الوقت" : "Time"}</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder={isRTL ? "اختر وقتًا" : "Select a time"} />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">{isRTL ? "ملاحظات إضافية (اختياري)" : "Additional Notes (optional)"}</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={isRTL ? "أضف أي معلومات إضافية قد تساعد المعالج" : "Add any additional information that might help your therapist"}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBookSession} 
          disabled={!selectedTherapist || !selectedDate || !selectedTime || !sessionType || loading}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              {isRTL ? "جاري الحجز..." : "Booking..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {isRTL ? "تأكيد الحجز" : "Confirm Booking"}
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionBookingForm;
