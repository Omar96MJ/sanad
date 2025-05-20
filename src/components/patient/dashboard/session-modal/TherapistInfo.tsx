
import { useLanguage } from "@/hooks/useLanguage";

interface TherapistInfoProps {
  therapist: {
    id: string;
    name: string;
    specialization: string;
    image: string;
  };
}

export const TherapistInfo = ({ therapist }: TherapistInfoProps) => {
  return (
    <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg">
      <img
        src={therapist.image}
        alt={therapist.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <p className="font-medium">{therapist.name}</p>
        <p className="text-sm text-muted-foreground">
          {therapist.specialization}
        </p>
      </div>
    </div>
  );
};
