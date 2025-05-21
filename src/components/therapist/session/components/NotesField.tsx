
import { useLanguage } from "@/hooks/useLanguage";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const NotesField = ({ notes, setNotes }: NotesFieldProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <label htmlFor="notes" className="text-sm font-medium">
        {t('notes')} ({t('optional')})
      </label>
      <Textarea
        id="notes"
        placeholder={t('enter_session_notes')}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};
