
import { useLanguage } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SessionTypeSelectProps {
  selectedTherapistDetails: any;
  eventTypeId: string;
  handleEventTypeChange: (typeId: string) => void;
}

export const SessionTypeSelect = ({
  selectedTherapistDetails,
  eventTypeId,
  handleEventTypeChange
}: SessionTypeSelectProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="space-y-2">
      <label htmlFor="session-type">{isRTL ? "نوع الجلسة" : "Session Type"}</label>
      <Select value={eventTypeId} onValueChange={handleEventTypeChange}>
        <SelectTrigger id="session-type">
          <SelectValue placeholder={isRTL ? "اختر نوع الجلسة" : "Select session type"} />
        </SelectTrigger>
        <SelectContent>
          {selectedTherapistDetails.eventTypes?.map((eventType: any) => (
            <SelectItem key={eventType.id} value={eventType.id}>
              {eventType.title} ({eventType.length} min)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
