
import { useLanguage } from "@/hooks/useLanguage";
import { Control } from "react-hook-form";
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
import { Skeleton } from "@/components/ui/skeleton";

// Form schema type
export type FormValues = z.infer<typeof import("../SessionModalForm").formSchema>;

interface TimePickerFieldProps {
  control: Control<FormValues>;
  availableSlots: string[];     // قائمة الأوقات المتاحة (HH:MM:SS)
  isLoadingSlots: boolean;    // حالة تحميل الأوقات
  disabled: boolean;          // لتعطيل الحقل
}

export const TimePickerField = ({
  control,
  availableSlots, 
  isLoadingSlots,
  disabled
 }: TimePickerFieldProps) => {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";
  
  const formatTimeForDisplay = (timeStringWithSeconds: string): string => {
    if (timeStringWithSeconds && timeStringWithSeconds.length >= 5) {
      return timeStringWithSeconds.substring(0, 5);
    }
    return timeStringWithSeconds;
  };


  let specificNoSlotsMessage = "";
  // الشرط: ليس في حالة تحميل، وليس معطلاً بسبب عدم اختيار طبيب/تاريخ، ولكن لا توجد أوقات متاحة
  if (!isLoadingSlots && !disabled && availableSlots.length === 0) {
    specificNoSlotsMessage = isRTL ? 'لا توجد أوقات متاحة' : 'No available times';
  }
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
            value={field.value || ""} // استخدام field.value وتوفير قيمة افتراضية للسلسلة الفارغة
            disabled={disabled || isLoadingSlots || availableSlots.length === 0} // تعطيل إضافي إذا لم تكن هناك أوقات
            dir={isRTL ? "rtl" : "ltr"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "اختر وقتًا" : "Select a time"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoadingSlots ? (
                <div className="flex items-center justify-center p-4">
                  <Skeleton className="h-4 w-20" />
                </div>
              ) : availableSlots.length > 0 ?  (
                availableSlots.map((time) => ( // time هنا هو HH:MM:SS
                  <SelectItem key={time} value={time.substring(0,5)}> {/* ⭐ القيمة المحفوظة في النموذج هي HH:MM */}
                    {formatTimeForDisplay(time)} {/* ✅ العرض هو HH:MM */}
                  </SelectItem>
                ))
              ) : (
                // هذه الرسالة تظهر فقط إذا فتح المستخدم القائمة المنسدلة وهي فارغة ومعطلة
                <SelectItem value="no-time-placeholder" disabled />
              )
              }
            </SelectContent>
          </Select>
          {specificNoSlotsMessage && (
            <p className="text-sm font-semibold text-red-700 pt-1">{specificNoSlotsMessage}</p>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
