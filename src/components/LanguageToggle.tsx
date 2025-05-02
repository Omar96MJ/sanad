
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setLanguage(newLang);
    // Force a reload to ensure all components pick up the language change
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="hidden sm:inline-block">{language === 'ar' ? 'العربية' : 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          <span className={language === 'en' ? 'font-medium' : ''}>
            {t('english')}
          </span>
          {language === 'en' && <span className={isRTL ? 'mr-2' : 'ml-2'}>✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>
          <span className={language === 'ar' ? 'font-medium' : ''}>
            {t('arabic')}
          </span>
          {language === 'ar' && <span className={isRTL ? 'mr-2' : 'ml-2'}>✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
