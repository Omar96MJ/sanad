
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientSearch, Patient } from "@/components/search/PatientSearch";
import { useLanguage } from "@/hooks/useLanguage";

interface UserTabProps {
  isTherapist: boolean;
  patients: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startNewConversation: (participantId: string) => void;
  onPatientSelect: (patient: Patient) => void;
}

const UserTab: React.FC<UserTabProps> = ({
  isTherapist,
  patients,
  searchQuery,
  setSearchQuery,
  startNewConversation,
  onPatientSelect
}) => {
  const { t } = useLanguage();
  
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isTherapist ? (
        <PatientSearch 
          onPatientSelect={onPatientSelect}
          buttonText={t('message') || "Message"}
        />
      ) : (
        // For non-therapists (patients), show the doctor list
        <>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isTherapist ? 
                  (t('search_patients') || "Search patients...") : 
                  (t('search_doctors') || "Search doctors...")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPatients.map((doctor) => (
              <Card key={doctor.id} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${doctor.id}`} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{doctor.name}</h4>
                      <p className="text-xs text-muted-foreground">{isTherapist ? t('patient') : t('doctor')}</p>
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
            
            {filteredPatients.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {isTherapist ? 
                  (t('no_patients_found') || "No patients found") : 
                  (t('no_doctors_found') || "No doctors found")}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserTab;
