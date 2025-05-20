
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/lib/types";
import { DoctorCard } from "@/components/UserCard";

interface TherapistCardProps {
  isVisible: boolean;
  doctor: Doctor;
  onBookAppointment: () => void;
}

export const TherapistCard = ({
  isVisible,
  doctor,
  onBookAppointment
}: TherapistCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card 
      className={`border border-border/50 card-hover transition-all duration-700 delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <CardHeader>
        <CardTitle>{t('your_therapist')}</CardTitle>
      </CardHeader>
      <CardContent>
        <DoctorCard doctor={doctor} />
        <Button 
          onClick={onBookAppointment} 
          className="w-full mt-6 btn-primary"
        >
          {t('schedule_session')}
        </Button>
      </CardContent>
    </Card>
  );
};
