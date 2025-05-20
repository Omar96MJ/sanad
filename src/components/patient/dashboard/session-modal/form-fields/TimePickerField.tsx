
import { useLanguage } from "@/hooks/useLanguage";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema type
export type FormValues = z.infer<typeof import("../SessionModalForm").formSchema>;

interface TimePickerFieldProps {
  control: Control<FormValues>;
}

export const TimePickerField = ({ control }: TimePickerFieldProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  // Watch for date changes
  const selectedDate = useWatch({
    control,
    name: "sessionDate",
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
  
  // Get time slots based on selected date
  const timeSlots = getAvailableTimeSlots(selectedDate);

  return (
    <FormField
      control={control}
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
  );
};
