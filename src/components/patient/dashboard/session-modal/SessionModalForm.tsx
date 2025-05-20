
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, isBefore, isSameDay } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TherapistInfo } from "./TherapistInfo";
import { TimeSlotSelector } from "./TimeSlotSelector";

interface SessionModalFormProps {
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const SessionModalForm = ({ onSubmit, isLoading, onCancel }: SessionModalFormProps) => {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";
  const calendarLocale = isRTL ? ar : undefined;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("");
  
  // Mock doctor data
  const mockDoctor = {
    id: "dr-smith",
    name: "Dr. Emily Smith",
    specialization: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
  };
  
  // Generate time slots based on the selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const today = new Date();
    const isSameCurrentDay = selectedDate.toDateString() === today.toDateString();
    
    // For today, only show times that are at least 2 hours from now
    const startHour = isSameCurrentDay ? Math.max(9, today.getHours() + 2) : 9;
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

  // Check if the date is in the past
  const disablePastDates = (date: Date) => {
    return isBefore(date, new Date()) && !isSameDay(date, new Date());
  };
  
  // Available time slots
  const timeSlots = getAvailableTimeSlots();

  return (
    <div className="space-y-4 py-4">
      {/* Therapist info */}
      <TherapistInfo therapist={mockDoctor} />
      
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
        <TimeSlotSelector 
          timeSlots={timeSlots} 
          selectedTime={selectedTime} 
          setSelectedTime={setSelectedTime}
        />
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
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          {isRTL ? "إلغاء" : "Cancel"}
        </Button>
        <Button 
          onClick={onSubmit} 
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
    </div>
  );
};
