
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, addDays, isAfter, isBefore } from "date-fns";
import { ar } from "date-fns/locale";
import { createAppointment } from "@/services/patientAppointmentService";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionBooked?: () => void;
}

export const SessionModal = ({ isOpen, onClose, onSessionBooked }: SessionModalProps) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === "ar";
  const calendarLocale = isRTL ? ar : undefined;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock doctor data
  const mockDoctor = {
    id: "dr-smith",
    name: "Dr. Emily Smith",
    specialization: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
  };

  // Reset form when dialog opens/closes
  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setSessionType("");
    setNotes("");
  };
  
  // Generate time slots based on the selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const today = new Date();
    const isSameDay = selectedDate.toDateString() === today.toDateString();
    
    // For today, only show times that are at least 2 hours from now
    const startHour = isSameDay ? Math.max(9, today.getHours() + 2) : 9;
    const endHour = 17; // 5 PM
    
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "PPP", { locale: calendarLocale });
  };
  
  // Handle booking session
  const handleBookSession = async () => {
    if (!user || !selectedDate || !selectedTime || !sessionType) {
      toast.error(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const sessionDateTime = new Date(selectedDate);
      sessionDateTime.setHours(hours, minutes, 0, 0);
      
      await createAppointment({
        patient_id: user.id,
        doctor_id: mockDoctor.id,
        doctor_name: mockDoctor.name,
        session_date: sessionDateTime.toISOString(),
        session_type: sessionType,
        status: 'upcoming'
      });
      
      toast.success(
        isRTL 
          ? "تم حجز جلستك بنجاح!" 
          : "Your session has been booked successfully!"
      );
      
      // Reset form and close dialog
      resetForm();
      onClose();
      
      // Refresh appointments list
      if (onSessionBooked) {
        onSessionBooked();
      }
    } catch (error) {
      console.error("Error booking session:", error);
      toast.error(
        isRTL 
          ? "حدث خطأ أثناء حجز الجلسة. يرجى المحاولة مرة أخرى." 
          : "An error occurred while booking your session. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the date is in the past
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
  
  // Available time slots
  const timeSlots = getAvailableTimeSlots();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isRTL ? "احجز جلسة جديدة" : "Schedule a New Session"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Therapist info */}
          <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg">
            <img
              src={mockDoctor.image}
              alt={mockDoctor.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{mockDoctor.name}</p>
              <p className="text-sm text-muted-foreground">
                {mockDoctor.specialization}
              </p>
            </div>
          </div>
          
          {/* Session type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isRTL ? "نوع الجلسة" : "Session Type"}
            </label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر نوع الجلسة" : "Select session type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="therapy_session">{isRTL ? "جلسة علاجية" : "Therapy Session"}</SelectItem>
                <SelectItem value="initial_consultation">{isRTL ? "استشارة أولية" : "Initial Consultation"}</SelectItem>
                <SelectItem value="follow_up">{isRTL ? "جلسة متابعة" : "Follow-up Session"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isRTL ? "التاريخ" : "Date"}
            </label>
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
                  {selectedDate ? formatDate(selectedDate) : (
                    isRTL ? "اختر تاريخًا" : "Pick a date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disablePastDates}
                  locale={calendarLocale}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Time selection */}
          {selectedDate && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? "الوقت" : "Time"}
              </label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? "اختر وقتًا" : "Select a time"} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.length > 0 ? (
                    timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {isRTL ? "لا توجد أوقات متاحة" : "No available times"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isRTL ? "ملاحظات (اختياري)" : "Notes (optional)"}
            </label>
            <Textarea
              placeholder={
                isRTL ? "أضف أي ملاحظات أو أعراض تريد مناقشتها" : "Add any notes or symptoms you want to discuss"
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            onClick={handleBookSession} 
            disabled={!selectedDate || !selectedTime || !sessionType || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRTL ? "جاري الحجز..." : "Booking..."}
              </>
            ) : (
              isRTL ? "تأكيد الحجز" : "Confirm Booking"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
