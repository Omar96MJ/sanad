
import { useLanguage } from "@/hooks/useLanguage";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorProfile } from "@/services/doctorService";

interface TherapistInfoProps {
  doctor: DoctorProfile | null;
  isLoading?: boolean;
}

export const TherapistInfo = ({ doctor, isLoading = false }: TherapistInfoProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (isLoading) {
    return (
      <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">
            {isRTL ? "طبيب" : "Dr"}
          </span>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">
            {isRTL ? "سيتم تعيين طبيب لك قريباً" : "A doctor will be assigned to you soon"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "يمكنك المتابعة مع حجز الجلسة" : "You can proceed with booking your session"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg">
      <img
        src={doctor.profile_image || "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"}
        alt={doctor.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <p className="font-medium">{doctor.name}</p>
        <p className="text-sm text-muted-foreground">
          {doctor.specialization || (isRTL ? "أخصائي نفسي" : "Psychologist")}
        </p>
      </div>
    </div>
  );
};
