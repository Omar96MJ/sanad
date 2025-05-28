
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/useLanguage";
import { searchPatients } from "@/services/patientService";

export interface Patient {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  role?: string;
  medical_record_number?: string;
}

interface PatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
  showEmail?: boolean;
  buttonText?: string;
}

export const PatientSearch = ({ 
  onPatientSelect, 
  showEmail = true, 
  buttonText = "Select" 
}: PatientSearchProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const timer = setTimeout(() => {
        performSearch();
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setPatients([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    if (searchQuery.trim().length === 0) {
      setPatients([]);
      setHasSearched(false);
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      console.log("Searching for patients with query:", searchQuery);
      
      const searchResults = await searchPatients(searchQuery);
      console.log("Search results:", searchResults);
      
      setPatients(searchResults);
    } catch (error) {
      console.error("Error in patient search:", error);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search_patients') || "Search patients by name, email, or medical record..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? t('searching') || "Searching..." : t('search') || "Search"}
        </Button>
      </form>
      
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">{t('searching') || "Searching"}...</span>
          </div>
        ) : (
          <>
            {patients.length === 0 && hasSearched ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  {searchQuery.trim() 
                    ? (t('no_patients_found') || "No patients found matching your search.") 
                    : (t('enter_search_term') || "Enter a name, email, or medical record to search for patients.")}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Searched in patients table for: "{searchQuery}"
                </p>
              </div>
            ) : (
              patients.map((patient) => (
                <Card key={patient.id} className="overflow-hidden border border-border/50 hover:shadow-sm transition-shadow">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.profile_image} alt={patient.name} />
                        <AvatarFallback>{patient.name?.substring(0, 2).toUpperCase() || "P"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{patient.name}</p>
                        {showEmail && (
                          <p className="text-xs text-muted-foreground">{patient.email}</p>
                        )}
                        {patient.medical_record_number && (
                          <p className="text-xs text-blue-600">
                            MRN: {patient.medical_record_number}
                          </p>
                        )}
                        <p className="text-xs text-green-600">
                          Patient (ID: {patient.id.substring(0, 8)}...)
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onPatientSelect(patient)}
                    >
                      {buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </div>
      
      {!hasSearched && searchQuery.trim().length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <p>{t('start_typing_to_search') || "Start typing to search for patients..."}</p>
          <p className="text-xs mt-1">Search by name, email, or medical record number</p>
        </div>
      )}
    </div>
  );
};
