
import { useLanguage } from "@/hooks/useLanguage";
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
import { Control } from "react-hook-form";
import { z } from "zod";

// Form schema type
export type FormValues = z.infer<typeof import("../SessionModalForm").formSchema>;

interface SessionTypeFieldProps {
  control: Control<FormValues>;
}

export const SessionTypeField = ({ control }: SessionTypeFieldProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <FormField
      control={control}
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
  );
};
