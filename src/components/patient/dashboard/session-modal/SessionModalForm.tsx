
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, isBefore, isSameDay } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TherapistInfo } from "./TherapistInfo";
import { useSessionForm, SessionFormData } from "./useSessionForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

// Form schema for validation
const formSchema = z.object({
  sessionType: z.string({
    required_error: "Please select a session type",
  }),
  sessionDate: z.date({
    required_error: "Please select a date",
  }),
  sessionTime: z.string({
    required_error: "Please select a time",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SessionModalFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onCancel: () => void;
}

export const SessionModalForm = ({ onSubmit, isLoading, setIsLoading, onCancel }: SessionModalFormProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const calendarLocale = isRTL ? ar : undefined;
  
  const { mockDoctor } = useSessionForm({ onClose: onCancel });
  
  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sessionType: "",
      sessionTime: "",
      notes: "",
    },
    mode: "onSubmit", // Changed from onChange to onSubmit
  });
  
  // Get available time slots based on selected date
  const getAvailableTimeSlots = (date?: Date) => {
    if (!date) return [];
    
    const today = new Date();
    const isSameCurrentDay = date.toDateString() === today.toDateString();
    
    // For today, only show times that are at least 2 hours from now
    const startHour = isSameCurrentDay ? Math.max(9, today.getHours() + 2) : 9;
    const endHour = 17; // 5 PM
    
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  };

  // Function to disable past dates
  const disablePastDates = (date: Date) => {
    return isBefore(date, new Date()) && !isSameDay(date, new Date());
  };
  
  // Get time slots based on selected date
  const selectedDate = form.watch("sessionDate");
  const timeSlots = getAvailableTimeSlots(selectedDate);
  
  // Handle form submission
  const handleFormSubmit = async (values: FormValues) => {
    try {
      // Format the data and submit
      setIsLoading(true);
      
      await onSubmit({
        sessionDate: values.sessionDate,
        sessionTime: values.sessionTime,
        sessionType: values.sessionType,
        notes: values.notes || "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        {/* Therapist info */}
        <TherapistInfo therapist={mockDoctor} />
        
        {/* Session type */}
        <FormField
          control={form.control}
          name="sessionType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                {isRTL ? "نوع الجلسة" : "Session Type"}
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر نوع الجلسة" : "Select session type"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="therapy_session">{isRTL ? "جلسة علاجية" : "Therapy Session"}</SelectItem>
                  <SelectItem value="initial_consultation">{isRTL ? "استشارة أولية" : "Initial Consultation"}</SelectItem>
                  <SelectItem value="follow_up">{isRTL ? "جلسة متابعة" : "Follow-up Session"}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Date selection */}
        <FormField
          control={form.control}
          name="sessionDate"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                {isRTL ? "التاريخ" : "Date"}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP", { locale: calendarLocale })
                      ) : (
                        <span>{isRTL ? "اختر تاريخًا" : "Pick a date"}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={disablePastDates}
                    locale={calendarLocale}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Time selection */}
        <FormField
          control={form.control}
          name="sessionTime"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                {isRTL ? "الوقت" : "Time"}
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!selectedDate || timeSlots.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر وقتًا" : "Select a time"} />
                  </SelectTrigger>
                </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                {isRTL ? "ملاحظات (اختياري)" : "Notes (optional)"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    isRTL ? "أضف أي ملاحظات أو أعراض تريد مناقشتها" : "Add any notes or symptoms you want to discuss"
                  }
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading} type="button">
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            type="submit"
            disabled={isLoading}
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
      </form>
    </Form>
  );
};
