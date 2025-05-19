
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Export as a named export to match the import in DashboardOverview.tsx
export const TherapistCard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const hasTherapist = false; // This would come from a real data source
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{t('my_therapist')}</CardTitle>
      </CardHeader>
      <CardContent>
        {hasTherapist ? (
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <h3 className="font-medium mb-1">Dr. Example Name</h3>
            <p className="text-sm text-muted-foreground mb-4">Clinical Psychologist</p>
            <Button 
              variant="outline" 
              className="mb-2 w-full"
              onClick={() => navigate('/therapist/123')}
            >
              {t('view_profile')}
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => navigate('/session-booking')}
            >
              {t('book_appointment')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-20 w-20 bg-muted rounded-full mb-3">
              <span className="text-2xl">👩‍⚕️</span>
            </div>
            <h3 className="font-medium mb-1">{t('no_therapist_assigned')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('find_therapist_message')}</p>
            <Button 
              className="w-full"
              onClick={() => navigate('/therapist-search')}
            >
              {t('find_a_therapist')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Also export as default for backward compatibility
export default TherapistCard;
