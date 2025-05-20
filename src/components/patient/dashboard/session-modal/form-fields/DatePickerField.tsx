
import { useLanguage } from "@/hooks/useLanguage";
import { format, isBefore, isSameDay } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Form schema type
export type FormValues = z.infer<typeof import("../SessionModalForm").formSchema>;

interface DatePickerFieldProps {
  control: Control<FormValues>;
}

export const DatePickerField = ({ control }: DatePickerFieldProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const calendarLocale = isRTL ? ar : undefined;

  // Function to disable past dates
  const disablePastDates = (date: Date) => {
    return isBefore(date, new Date()) && !isSameDay(date, new Date());
  };

  return (
    <FormField
      control={control}
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
  );
};
