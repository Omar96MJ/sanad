
import { useLanguage } from "@/hooks/useLanguage";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorProfile } from "@/services/doctorService";

interface TherapistInfoProps {
  doctor: DoctorProfile | null;
  isLoading?: boolean;
  doctors?: DoctorProfile[];
}

export const TherapistInfo = ({ doctor, isLoading = false, doctors = [] }: TherapistInfoProps) => {
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

  // Show fallback message only if no doctors are available at all
  if (!doctor && doctors.length === 0) {
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

  // If we have doctors available but none selected, show the first available doctor
  const displayDoctor = doctor || (doctors.length > 0 ? doctors[0] : null);

  if (!displayDoctor) {
    return (
      <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">
            {isRTL ? "طبيب" : "Dr"}
          </span>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">
            {isRTL ? "جاري تحميل بيانات الطبيب..." : "Loading doctor information..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg">
      <img
        src={displayDoctor.profile_image || "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"}
        alt={displayDoctor.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <p className="font-medium">{displayDoctor.name}</p>
        <p className="text-sm text-muted-foreground">
          {displayDoctor.specialization || (isRTL ? "أخصائي نفسي" : "Mental Health Specialist")}
        </p>
      </div>
    </div>
  );
};
