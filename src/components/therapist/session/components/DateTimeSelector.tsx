
import { useState } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeSelectorProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  dateError?: boolean;
  timeError?: boolean;
}

export const DateTimeSelector = ({ 
  date, 
  setDate, 
  time, 
  setTime,
  dateError,
  timeError
}: DateTimeSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('date')}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : t('select_date')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {dateError && (
          <p className="text-red-500 text-xs">{t('date_required')}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="session_time" className="text-sm font-medium">
          {t('time')}
        </label>
        <Input
          id="session_time"
          placeholder="14:00"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        {timeError && (
          <p className="text-red-500 text-xs">{t('time_required')}</p>
        )}
      </div>
    </div>
  );
};
