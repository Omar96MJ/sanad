
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
import { toast } from "sonner";
import { CalendarIcon, Clock, Users, Calendar as CalendarCheck } from "lucide-react";
import { TherapistProfile } from "@/lib/therapist-types";
import { 
  getCalUsers, 
  getCalAvailability, 
  createCalBooking, 
  CalUser,
  CalAvailability
} from "@/lib/cal-api";

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

  const [therapists, setTherapists] = useState<CalUser[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [selectedTherapistDetails, setSelectedTherapistDetails] = useState<CalUser | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<CalAvailability[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch therapists on component mount
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const calUsers = await getCalUsers();
        setTherapists(calUsers);
      } catch (error) {
        toast.error(isRTL 
          ? "حدث خطأ أثناء تحميل قائمة المعالجين"
          : "Error loading therapists");
      } finally {
        setLoadingTherapists(false);
      }
    };

    fetchTherapists();
  }, [isRTL]);

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

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedTherapist || !eventTypeId || !selectedDate) return;

      setLoadingSlots(true);
      try {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const nextDay = addDays(selectedDate, 1);
        const nextDayString = format(nextDay, 'yyyy-MM-dd');

        const availability = await getCalAvailability(
          selectedTherapist,
          eventTypeId,
          dateString,
          nextDayString
        );

        setAvailableSlots(availability);
      } catch (error) {
        toast.error(isRTL 
          ? "حدث خطأ أثناء تحميل المواعيد المتاحة"
          : "Error loading available time slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    if (selectedTherapist && eventTypeId && selectedDate) {
      fetchAvailability();
    }
  }, [selectedTherapist, eventTypeId, selectedDate, isRTL]);

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
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const startTime = `${dateString}T${selectedTime}:00`;
      
      // Calculate end time based on session type
      const sessionTypeObj = selectedTherapistDetails?.eventTypes?.find(et => et.id === eventTypeId);
      const durationMinutes = sessionTypeObj?.length || 60;
      
      // Simple way to calculate end time
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      const endTime = endDate.toISOString();

      await createCalBooking(
        selectedTherapist,
        eventTypeId,
        startTime,
        endTime,
        user.name,
        user.email || "",
        notes
      );

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
