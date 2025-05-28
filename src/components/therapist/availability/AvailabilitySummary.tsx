
import { useLanguage } from "@/hooks/useLanguage";
import { AvailabilitySlot } from "@/hooks/useAvailability";
import { daysOfWeek } from "./constants";

interface AvailabilitySummaryProps {
  availability: AvailabilitySlot[];
}

export const AvailabilitySummary = ({ availability }: AvailabilitySummaryProps) => {
  const { t } = useLanguage();

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">{t('current_availability')}:</h3>
      <div className="space-y-2">
        {availability.length === 0 ? (
          <p className="text-muted-foreground">{t('no_availability_set')}</p>
        ) : (
          daysOfWeek.map((day, dayIndex) => {
            const dayAvailability = availability.filter(a => a.day_of_week === dayIndex);
            if (dayAvailability.length === 0) return null;
            
            return (
              <div key={day} className="flex items-center gap-2">
                <span className="font-medium w-24">{t(day)}:</span>
                <span>
                  {dayAvailability.map((slot, i) => (
                    <span key={slot.id || i}>
                      {i > 0 && ", "}
                      {slot.start_time} - {slot.end_time}
                    </span>
                  ))}
                </span>
              </div>
            );
          }).filter(Boolean)
        )}
      </div>
    </div>
  );
};
