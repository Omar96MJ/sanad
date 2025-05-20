
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Clock } from "lucide-react";
import { TherapistProfile } from "@/lib/therapist-types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Mock data for therapists
const mockTherapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    username: "sarah-johnson",
    bio: "Specializing in anxiety and depression treatment with 8+ years of experience",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
    eventTypes: [
      { id: "1", title: "Initial Consultation", length: 60 },
      { id: "2", title: "Follow-up Session", length: 45 },
      { id: "3", title: "Emergency Session", length: 30 }
    ]
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael@example.com",
    username: "michael-chen",
    bio: "Helping families build stronger relationships for over 10 years",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256",
    eventTypes: [
      { id: "1", title: "Family Therapy Session", length: 60 },
      { id: "2", title: "Follow-up Session", length: 45 }
    ]
  },
  {
    id: "3",
    name: "Dr. Aisha Rahman",
    email: "aisha@example.com",
    username: "aisha-rahman",
    bio: "Specialized in PTSD and trauma recovery with a compassionate approach",
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256",
    eventTypes: [
      { id: "1", title: "Trauma Therapy", length: 60 },
      { id: "2", title: "Follow-up Session", length: 45 }
    ]
  }
];

// Session types
const sessionTypes = [
  { value: "initial", label: { en: "Initial Consultation (60 min)", ar: "جلسة استشارية أولى (60 دقيقة)" } },
  { value: "followup", label: { en: "Follow-up Session (45 min)", ar: "جلسة متابعة (45 دقيقة)" } },
  { value: "emergency", label: { en: "Emergency Session (30 min)", ar: "جلسة طارئة (30 دقيقة)" } },
];

interface SessionBookingFormProps {
  onSuccess?: () => void;
  inDashboard?: boolean;
}

const SessionBookingForm = ({ onSuccess, inDashboard = false }: SessionBookingFormProps) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === "ar";

  const [therapists, setTherapists] = useState(mockTherapists);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [selectedTherapistDetails, setSelectedTherapistDetails] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Set mock therapists
  useEffect(() => {
    setLoadingTherapists(true);
    // Simulate API call
    setTimeout(() => {
      setTherapists(mockTherapists);
      setLoadingTherapists(false);
    }, 500);
  }, []);

  // Fetch therapist details when selection changes
  useEffect(() => {
    if (selectedTherapist) {
      const therapist = therapists.find(t => t.id === selectedTherapist);
      setSelectedTherapistDetails(therapist || null);
      
      // Reset related fields
      setEventTypeId("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setAvailableSlots([]);
    } else {
      setSelectedTherapistDetails(null);
    }
  }, [selectedTherapist, therapists]);

  // Generate available slots when date changes
  useEffect(() => {
    const generateMockAvailability = async () => {
      if (!selectedTherapist || !eventTypeId || !selectedDate) return;

      setLoadingSlots(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const today = new Date();
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      // Generate mock slots based on date
      const mockSlots = [];
      
      // Morning slots
      mockSlots.push({ date: dateString, slots: [
        { startTime: "09:00", endTime: "10:00" },
        { startTime: "10:00", endTime: "11:00" },
        { startTime: "11:00", endTime: "12:00" },
      ]});
      
      // Afternoon slots - fewer if it's today (pretend some are booked)
      if (isSameDay(selectedDate, today)) {
        mockSlots.push({ date: dateString, slots: [
          { startTime: "14:00", endTime: "15:00" },
        ]});
      } else {
        mockSlots.push({ date: dateString, slots: [
          { startTime: "14:00", endTime: "15:00" },
          { startTime: "15:00", endTime: "16:00" },
          { startTime: "16:00", endTime: "17:00" },
        ]});
      }
      
      setAvailableSlots(mockSlots);
      setLoadingSlots(false);
    };

    if (selectedTherapist && eventTypeId && selectedDate) {
      generateMockAvailability();
    }
  }, [selectedTherapist, eventTypeId, selectedDate]);

  // Handle therapist selection
  const handleTherapistChange = (therapistId: string) => {
    setSelectedTherapist(therapistId);
    setEventTypeId("");
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  // Handle event type selection
  const handleEventTypeChange = (typeId: string) => {
    setEventTypeId(typeId);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  // Handle booking session
  const handleBookSession = async () => {
    if (!selectedTherapist || !eventTypeId || !selectedDate || !selectedTime) {
      toast.error(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error(isRTL ? "يجب تسجيل الدخول لحجز جلسة" : "You must be logged in to book a session");
      return;
    }

    setLoading(true);

    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        isRTL 
          ? "تم حجز جلستك بنجاح! سنرسل لك تأكيدًا عبر البريد الإلكتروني." 
          : "Your session has been booked successfully! We'll send you a confirmation email."
      );
      
      // Reset form
      setSelectedTherapist("");
      setSelectedTherapistDetails(null);
      setEventTypeId("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setNotes("");
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // If in dashboard, no need to navigate
      if (!inDashboard) {
        navigate("/patient-dashboard");
      }
      
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء حجز الجلسة" : "Error booking your session");
    } finally {
      setLoading(false);
    }
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

  // Find available time slots for the selected date
  const timeSlots = selectedDate && availableSlots.length > 0
    ? availableSlots
        .find(day => day.date === format(selectedDate, 'yyyy-MM-dd'))
        ?.slots.map(slot => slot.startTime) || []
    : [];

  return (
    <Card className={`border shadow-sm ${inDashboard ? 'shadow-none border-0' : ''}`}>
      {!inDashboard && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {isRTL ? "حجز جلسة جديدة" : "Schedule a New Session"}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? "اختر المعالج والتاريخ والوقت المناسب لك"
              : "Select your preferred therapist, date, and time"}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="therapist">{isRTL ? "المعالج" : "Therapist"}</label>
          <Select value={selectedTherapist} onValueChange={handleTherapistChange}>
            <SelectTrigger id="therapist" className="w-full">
              <SelectValue placeholder={isRTL ? "اختر معالج" : "Select a therapist"} />
            </SelectTrigger>
            <SelectContent>
              {loadingTherapists ? (
                <SelectItem value="loading" disabled>
                  {isRTL ? "جاري تحميل المعالجين..." : "Loading therapists..."}
                </SelectItem>
              ) : (
                therapists.map((therapist) => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedTherapistDetails && (
            <div className="mt-4 p-4 bg-muted/40 rounded-lg">
              <div className="flex gap-4 items-start">
                {selectedTherapistDetails.avatar && (
                  <img 
                    src={selectedTherapistDetails.avatar} 
                    alt={selectedTherapistDetails.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium">{selectedTherapistDetails.name}</h3>
                  {selectedTherapistDetails.bio && (
                    <p className="text-sm mt-1">{selectedTherapistDetails.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedTherapistDetails && (
          <div className="space-y-2">
            <label htmlFor="session-type">{isRTL ? "نوع الجلسة" : "Session Type"}</label>
            <Select value={eventTypeId} onValueChange={handleEventTypeChange}>
              <SelectTrigger id="session-type">
                <SelectValue placeholder={isRTL ? "اختر نوع الجلسة" : "Select session type"} />
              </SelectTrigger>
              <SelectContent>
                {selectedTherapistDetails.eventTypes?.map((eventType) => (
                  <SelectItem key={eventType.id} value={eventType.id}>
                    {eventType.title} ({eventType.length} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {eventTypeId && (
          <div className="space-y-2">
            <label>{isRTL ? "التاريخ" : "Date"}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>{isRTL ? "اختر تاريخًا" : "Pick a date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disablePastDates}
                  initialFocus
                  className="rounded-md border pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {selectedDate && (
          <div className="space-y-2">
            <label htmlFor="time">{isRTL ? "الوقت" : "Time"}</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder={isRTL ? "اختر وقتًا" : "Select a time"} />
              </SelectTrigger>
              <SelectContent>
                {loadingSlots ? (
                  <SelectItem value="loading" disabled>
                    {isRTL ? "جاري تحميل المواعيد المتاحة..." : "Loading available times..."}
                  </SelectItem>
                ) : timeSlots.length > 0 ? (
                  timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {isRTL ? "لا توجد مواعيد متاحة في هذا اليوم" : "No available times for this day"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="notes">{isRTL ? "ملاحظات إضافية (اختياري)" : "Additional Notes (optional)"}</label>
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
          disabled={!selectedTherapist || !eventTypeId || !selectedDate || !selectedTime || loading}
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
