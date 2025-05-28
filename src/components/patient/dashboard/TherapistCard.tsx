
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorCard } from "@/components/UserCard";
import { DoctorProfile } from "@/lib/therapist-types";

interface TherapistCardProps {
  isVisible: boolean;
  doctor: DoctorProfile | null;
  isLoadingDoctor?: boolean;
  onBookAppointment: () => void;
}

export const TherapistCard = ({
  isVisible,
  doctor,
  isLoadingDoctor = false,
  onBookAppointment
}: TherapistCardProps) => {
   const {t, language } = useLanguage();
  const isRTL = language === 'ar';
  return (
    <Card 
      className={`border border-border/50 card-hover transition-all duration-700 delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <CardHeader dir={isRTL ? "rtl" : "ltr"}>
        <CardTitle>{t('your_therapist')}</CardTitle>
      </CardHeader>
      <CardContent dir={isRTL ? "rtl" : "ltr"}>
        {isLoadingDoctor ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : doctor ? (
          <>
            <DoctorCard doctor={{
              id: doctor.id,            
              name: doctor.name,                     
              profileImage: doctor.profile_image,    
              specialization: doctor.specialization,
              bio: doctor.bio,                        
              patients: doctor.patients_count,      
              yearsOfExperience: doctor.years_of_experience,
            }} />
            <Button 
              onClick={onBookAppointment} 
              className="w-full mt-6 btn-primary"
            >
              {t('schedule_session')}
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {t('no_therapist_assigned')}
            </p>
            <Button 
              onClick={onBookAppointment} 
              className="btn-primary"
            >
              {t('find_therapist')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
