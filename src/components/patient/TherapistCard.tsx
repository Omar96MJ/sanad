
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/lib/types";
import { useLanguage } from "@/hooks/useLanguage";

interface TherapistCardProps {
  doctor: Doctor;
  onSelect?: () => void;
  selected?: boolean;
}

export function TherapistCard({ doctor, onSelect, selected = false }: TherapistCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card className={`overflow-hidden h-full transition-all ${selected ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={doctor.profileImage} alt={doctor.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {doctor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
          <p className="text-primary font-medium mb-2">{doctor.specialization}</p>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{doctor.bio}</p>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-2 mb-4">
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-lg font-semibold">{doctor.patients}</p>
              <p className="text-xs text-muted-foreground">{t('patients')}</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-lg font-semibold">{doctor.yearsOfExperience}</p>
              <p className="text-xs text-muted-foreground">{t('years_experience')}</p>
            </div>
          </div>
          
          {onSelect && (
            <Button 
              onClick={onSelect} 
              className="w-full"
              variant={selected ? "default" : "outline"}
            >
              {selected ? t('selected') : t('view_profile')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TherapistCard;
