
import { useLanguage } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSlotSelectorProps {
  timeSlots: string[];
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export const TimeSlotSelector = ({ timeSlots, selectedTime, setSelectedTime }: TimeSlotSelectorProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
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
  );
};
