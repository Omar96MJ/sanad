
import { Clock, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { daysOfWeek, timeSlots } from "./constants";

interface AvailabilityGridProps {
  currentGrid: boolean[][];
  editMode: boolean;
  onSlotToggle: (dayIndex: number, hourIndex: number) => void;
}

export const AvailabilityGrid = ({ 
  currentGrid, 
  editMode, 
  onSlotToggle 
}: AvailabilityGridProps) => {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="grid grid-cols-[100px_repeat(12,1fr)] gap-1 mb-4">
          <div className="font-medium text-center">{t('day')}/{t('time')}</div>
          {timeSlots.map((time, i) => (
            <div key={i} className="font-medium text-center text-sm">
              <div className="flex items-center justify-center">
                <Clock className="h-3 w-3 mr-1" />
                {time}
              </div>
            </div>
          ))}
        </div>
        
        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} className="grid grid-cols-[100px_repeat(12,1fr)] gap-1 mb-1">
            <div className="font-medium flex items-center">
              {t(day)}
            </div>
            {timeSlots.map((_, hourIndex) => (
              <div 
                key={hourIndex}
                className={`
                  h-12 rounded-md border flex items-center justify-center transition-colors
                  ${currentGrid[dayIndex]?.[hourIndex] ? 'bg-primary/20 border-primary/50' : 'bg-muted/20 border-muted/50'}
                  ${editMode ? 'cursor-pointer hover:opacity-80' : ''}
                `}
                onClick={() => onSlotToggle(dayIndex, hourIndex)}
              >
                {currentGrid[dayIndex]?.[hourIndex] && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
