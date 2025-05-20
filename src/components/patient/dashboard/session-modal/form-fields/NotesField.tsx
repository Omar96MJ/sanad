
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
import { Textarea } from "@/components/ui/textarea";

// Form schema type
export type FormValues = z.infer<typeof import("../SessionModalForm").formSchema>;

interface NotesFieldProps {
  control: Control<FormValues>;
}

export const NotesField = ({ control }: NotesFieldProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>
            {isRTL ? "ملاحظات (اختياري)" : "Notes (optional)"}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={
                isRTL ? "أضف أي ملاحظات أو أعراض تريد مناقشتها" : "Add any notes or symptoms you want to discuss"
              }
              className="resize-none"
              rows={3}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
