
import { useLanguage } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TherapistSelectProps {
  therapists: any[];
  loadingTherapists: boolean;
  selectedTherapist: string;
  selectedTherapistDetails: any | null;
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
          ) : (
            therapists.map((therapist) => (
              <SelectItem key={therapist.id} value={therapist.id}>
                {therapist.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedTherapistDetails && (
        <div className="mt-4 p-4 bg-muted/40 rounded-lg">
          <div className="flex gap-4 items-start">
            {selectedTherapistDetails.avatar && (
              <img 
                src={selectedTherapistDetails.avatar} 
                alt={selectedTherapistDetails.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-medium">{selectedTherapistDetails.name}</h3>
              {selectedTherapistDetails.bio && (
                <p className="text-sm mt-1">{selectedTherapistDetails.bio}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
