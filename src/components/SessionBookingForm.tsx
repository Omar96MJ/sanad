
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { format, addDays, isAfter, isBefore, isSameDay } from "date-fns";
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
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Session types
const sessionTypes = [
  { value: "initial_consultation", label: { en: "Initial Consultation (60 min)", ar: "جلسة استشارية أولى (60 دقيقة)" } },
  { value: "follow_up", label: { en: "Follow-up Session (45 min)", ar: "جلسة متابعة (45 دقيقة)" } },
  { value: "therapy_session", label: { en: "Therapy Session (60 min)", ar: "جلسة علاج (60 دقيقة)" } },
  { value: "emergency", label: { en: "Emergency Session (30 min)", ar: "جلسة طارئة (30 دقيقة)" } },
];

const SessionBookingForm = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === "ar";

  const [therapists, setTherapists] = useState<any[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [selectedTherapistDetails, setSelectedTherapistDetails] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch therapists from Supabase
  useEffect(() => {
    const fetchTherapists = async () => {
      if (!user) return;
      
      setLoadingTherapists(true);
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*');
        
        if (error) throw error;
        
        setTherapists(data || []);
      } catch (error) {
        console.error('Error fetching therapists:', error);
        toast.error(t('error_loading_therapists'));
      } finally {
        setLoadingTherapists(false);
      }
    };

    fetchTherapists();
  }, [user, t]);

  // Fetch therapist details when selection changes
  useEffect(() => {
    if (selectedTherapist) {
      const therapist = therapists.find(t => t.id === selectedTherapist);
      setSelectedTherapistDetails(therapist || null);
      
      // Reset related fields
      setSessionType("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setAvailableSlots([]);
    } else {
      setSelectedTherapistDetails(null);
    }
  }, [selectedTherapist, therapists]);

  // Generate available slots when date changes
  useEffect(() => {
    const generateAvailability = async () => {
      if (!selectedTherapist || !sessionType || !selectedDate) return;

      setLoadingSlots(true);
      
      try {
        // This would be replaced with an actual API call in a production app
        // For now, we'll generate mock slots similar to before
        const today = new Date();
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        
        // Generate slots based on date
        const slots = [];
        
        // Morning slots
        slots.push({ date: dateString, slots: [
          { startTime: "09:00", endTime: "10:00" },
          { startTime: "10:00", endTime: "11:00" },
          { startTime: "11:00", endTime: "12:00" },
        ]});
        
        // Afternoon slots - fewer if it's today (pretend some are booked)
        if (isSameDay(selectedDate, today)) {
          slots.push({ date: dateString, slots: [
            { startTime: "14:00", endTime: "15:00" },
          ]});
        } else {
          slots.push({ date: dateString, slots: [
            { startTime: "14:00", endTime: "15:00" },
            { startTime: "15:00", endTime: "16:00" },
            { startTime: "16:00", endTime: "17:00" },
          ]});
        }
        
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error generating availability:', error);
        toast.error(t('error_loading_available_time_slots'));
      } finally {
        setLoadingSlots(false);
      }
    };

    if (selectedTherapist && sessionType && selectedDate) {
      generateAvailability();
    }
  }, [selectedTherapist, sessionType, selectedDate, t]);

  // Handle therapist selection
  const handleTherapistChange = (therapistId: string) => {
    setSelectedTherapist(therapistId);
    setSessionType("");
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  // Handle session type selection
  const handleSessionTypeChange = (type: string) => {
    setSessionType(type);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  // Handle booking session
  const handleBookSession = async () => {
    if (!selectedTherapist || !sessionType || !selectedDate || !selectedTime) {
      toast.error(t('fill_all_required_fields'));
      return;
    }

    if (!user) {
      toast.error(t('login_required_for_booking'));
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const sessionDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      sessionDate.setHours(hours, minutes, 0, 0);

      // Create appointment in Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: selectedTherapist,
          patient_id: user.id,
          patient_name: user.name,
          session_date: sessionDate.toISOString(),
          session_type: sessionType,
          notes: notes || null,
          status: 'scheduled'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Also create entry in patient_appointments for patient dashboard display
      const { error: patientApptError } = await supabase
        .from('patient_appointments')
        .insert({
          patient_id: user.id,
          doctor_id: selectedTherapist,
          doctor_name: selectedTherapistDetails.name,
          session_date: sessionDate.toISOString(),
          session_type: sessionType,
          status: 'upcoming'
        });
        
      if (patientApptError) {
        console.error("Error creating patient appointment:", patientApptError);
      }
      
      toast.success(t('appointment_booked_successfully'));
      
      // Reset form
      setSelectedTherapist("");
      setSelectedTherapistDetails(null);
      setSessionType("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setNotes("");
      
      // Navigate to patient dashboard
      navigate('/patient-dashboard');
      
    } catch (error: any) {
      console.error('Error booking session:', error);
      toast.error(t('error_booking_appointment'));
    } finally {
      setLoading(false);
    }
  };

  const disablePastDates = (date: Date) => {
    return isBefore(date, new Date()) && !isSameDay(date, new Date());
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
          <CalendarIcon className="h-5 w-5 text-primary" />
          {t('schedule_new_session')}
        </CardTitle>
        <CardDescription>
          {t('select_preferred_options')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="therapist">{t('therapist')}</label>
          <Select value={selectedTherapist} onValueChange={handleTherapistChange}>
            <SelectTrigger id="therapist" className="w-full">
              <SelectValue placeholder={t('select_therapist')} />
            </SelectTrigger>
            <SelectContent>
              {loadingTherapists ? (
                <SelectItem value="loading" disabled>
                  {t('loading_therapists')}
                </SelectItem>
              ) : therapists.length > 0 ? (
                therapists.map((therapist) => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  {t('no_therapists_found')}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {selectedTherapistDetails && (
            <div className="mt-4 p-4 bg-muted/40 rounded-lg">
              <div className="flex gap-4 items-start">
                {selectedTherapistDetails.profile_image && (
                  <img 
                    src={selectedTherapistDetails.profile_image} 
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
            <label htmlFor="session-type">{t('session_type')}</label>
            <Select value={sessionType} onValueChange={handleSessionTypeChange}>
              <SelectTrigger id="session-type">
                <SelectValue placeholder={t('select_session_type')} />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {language === 'ar' ? type.label.ar : type.label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {sessionType && (
          <div className="space-y-2">
            <label>{t('date')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>{t('pick_date')}</span>
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
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {selectedDate && (
          <div className="space-y-2">
            <label htmlFor="time">{t('time')}</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder={t('select_time')} />
              </SelectTrigger>
              <SelectContent>
                {loadingSlots ? (
                  <SelectItem value="loading" disabled>
                    {t('loading_available_times')}
                  </SelectItem>
                ) : timeSlots.length > 0 ? (
                  timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {t('no_available_times')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="notes">{t('additional_notes')}</label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('additional_notes_placeholder')}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBookSession} 
          disabled={!selectedTherapist || !sessionType || !selectedDate || !selectedTime || loading}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              {t('booking')}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {t('confirm_booking')}
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SessionBookingForm;
