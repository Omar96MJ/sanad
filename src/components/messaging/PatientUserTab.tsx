
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, PlusCircle, AlertTriangle, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/useLanguage";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PatientUserTabProps {
  doctors: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startNewConversation: (participantId: string) => void;
  isLoading?: boolean;
}

const PatientUserTab: React.FC<PatientUserTabProps> = ({
  doctors,
  searchQuery,
  setSearchQuery,
  startNewConversation,
  isLoading = false
}) => {
  const { t } = useLanguage();
  
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('search_doctors') || "Search doctors..."}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredDoctors.length === 0 && (
        <Alert variant="default" className="bg-primary/5">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {searchQuery 
              ? (t('no_doctors_match_search') || "No doctors match your search.") 
              : (t('no_doctors_available') || "No doctors available.")}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="border border-border/50 transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${doctor.id}`} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{doctor.name}</h4>
                  <p className="text-xs text-muted-foreground">{t('doctor')}</p>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                size="sm"
                onClick={() => startNewConversation(doctor.id)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('message') || "Message"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredDoctors.length === 0 && doctors.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">{t('no_doctors_found') || "No doctors found"}</h3>
          <p className="text-muted-foreground mt-2">
            {t('doctors_will_appear_here') || "Doctors will appear here when available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientUserTab;
