
import { format } from "date-fns";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isBefore, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface DateTimeSelectionProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  loadingSlots: boolean;
  timeSlots: string[];
}

export const DateTimeSelection = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  loadingSlots,
  timeSlots
}: DateTimeSelectionProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Function to disable past dates
  const disablePastDates = (date: Date) => {
    return isBefore(date, new Date()) && !isSameDay(date, new Date());
  };

  return (
    <>
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
    </>
  );
};
