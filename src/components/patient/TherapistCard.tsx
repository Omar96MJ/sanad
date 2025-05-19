
import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/lib/types";
import { Users, Calendar } from "lucide-react";

interface TherapistCardProps {
  doctor: Doctor;
  onSelect: () => void;
  selected?: boolean;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  doctor,
  onSelect,
  selected = false,
}) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  return (
    <Card className="h-full hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={doctor.profileImage} alt={doctor.name} />
            <AvatarFallback className="text-lg">{doctor.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
          <p className="text-muted-foreground mb-3">{doctor.specialization}</p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{doctor.patients} {t('patients')}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{doctor.yearsOfExperience} {t('years')}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-5 line-clamp-3">
            {doctor.bio || t('bio_placeholder')}
          </p>
          
          <Button 
            onClick={onSelect} 
            className="w-full" 
            variant={selected ? "secondary" : "default"}
          >
            {selected ? t('selected') : t('select_as_my_therapist')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistCard;
