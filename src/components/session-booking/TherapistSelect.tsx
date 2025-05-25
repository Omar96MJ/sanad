
import { useLanguage } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorProfile } from "@/services/doctorService";

interface TherapistSelectProps {
  therapists: DoctorProfile[];
  loadingTherapists: boolean;
  selectedTherapist: string;
  selectedTherapistDetails: DoctorProfile | null;
  handleTherapistChange: (therapistId: string) => void;
}

export const TherapistSelect = ({
  therapists,
  loadingTherapists,
  selectedTherapist,
  selectedTherapistDetails,
  handleTherapistChange
}: TherapistSelectProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="space-y-2">
      <label htmlFor="therapist">{isRTL ? "المعالج" : "Therapist"}</label>
      <Select value={selectedTherapist} onValueChange={handleTherapistChange}>
        <SelectTrigger id="therapist" className="w-full">
          <SelectValue placeholder={isRTL ? "اختر معالج" : "Select a therapist"} />
        </SelectTrigger>
        <SelectContent>
          {loadingTherapists ? (
            <SelectItem value="loading" disabled>
              {isRTL ? "جاري تحميل المعالجين..." : "Loading therapists..."}
            </SelectItem>
          ) : therapists.length > 0 ? (
            therapists.map((therapist) => (
              <SelectItem key={therapist.id} value={therapist.id}>
                {therapist.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-therapists" disabled>
              {isRTL ? "لا يوجد معالجين متاحين حاليًا. يرجى المحاولة لاحقًا." : "No therapists available at the moment. Please try again later."}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {selectedTherapistDetails && (
        <div className="mt-4 p-4 bg-muted/40 rounded-lg">
          <div className="flex gap-4 items-start">
            {selectedTherapistDetails.profile_image && (
              <img 
                src={selectedTherapistDetails.profile_image} 
                alt={selectedTherapistDetails.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-medium">{selectedTherapistDetails.name}</h3>
              {selectedTherapistDetails.specialization && (
                <p className="text-sm text-muted-foreground mb-1">
                  {selectedTherapistDetails.specialization}
                </p>
              )}
              {selectedTherapistDetails.bio && (
                <p className="text-sm mt-1">{selectedTherapistDetails.bio}</p>
              )}
              {selectedTherapistDetails.years_of_experience && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedTherapistDetails.years_of_experience} {isRTL ? "سنوات خبرة" : "years of experience"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
