
import { useLanguage } from "@/hooks/useLanguage";
import { Textarea } from "@/components/ui/textarea";

interface SessionNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const SessionNotes = ({ notes, setNotes }: SessionNotesProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="space-y-2">
      <label htmlFor="notes">{isRTL ? "ملاحظات إضافية (اختياري)" : "Additional Notes (optional)"}</label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={isRTL ? "أضف أي معلومات إضافية قد تساعد المعالج" : "Add any additional information that might help your therapist"}
        className="min-h-[100px]"
      />
    </div>
  );
};
