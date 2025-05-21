
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

export interface Patient {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  role?: string;  // Make role optional to match with existing code
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
        searchPatients();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const searchPatients = async () => {
    if (searchQuery.trim().length === 0) {
      setPatients([]);
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, profile_image')
        .eq('role', 'patient')
        .ilike('name', `%${searchQuery}%`)
        .order('name', { ascending: true });
        
      if (error) {
        console.error("Error searching patients:", error);
        return;
      }
      
      setPatients(data || []);
    } catch (error) {
      console.error("Error in patient search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPatients();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search_patients')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          {t('search')}
        </Button>
      </form>
      
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-4">{t('searching')}...</p>
        ) : (
          <>
            {patients.length === 0 && hasSearched ? (
              <p className="text-center text-muted-foreground py-4">{t('no_patients_found')}</p>
            ) : (
              patients.map((patient) => (
                <Card key={patient.id} className="overflow-hidden border border-border/50">
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
    </div>
  );
};
