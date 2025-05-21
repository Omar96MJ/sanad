
import { useLanguage } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SessionTypeSelectorProps {
  sessionType: string;
  setSessionType: (type: string) => void;
  error?: boolean;
}

export const SessionTypeSelector = ({ 
  sessionType, 
  setSessionType,
  error
}: SessionTypeSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <label htmlFor="session_type" className="text-sm font-medium">
        {t('session_type')}
      </label>
      <Select
        value={sessionType}
        onValueChange={setSessionType}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('select_session_type')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="initial_consultation">{t('initial_consultation')}</SelectItem>
          <SelectItem value="follow_up">{t('follow_up')}</SelectItem>
          <SelectItem value="therapy_session">{t('therapy_session')}</SelectItem>
          <SelectItem value="evaluation">{t('evaluation')}</SelectItem>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-xs">{t('session_type_required')}</p>
      )}
    </div>
  );
};
