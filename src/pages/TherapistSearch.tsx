
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TherapistCard from "@/components/patient/TherapistCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/lib/types";
import { Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const TherapistSearch = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [therapists, setTherapists] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchTherapists();
  }, [user, navigate]);

  const fetchTherapists = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from the database
      const { data, error } = await supabase
        .from('doctors')
        .select('*');

      if (error) {
        throw error;
      }

      const formattedTherapists: Doctor[] = data.map((therapist: any) => ({
        id: therapist.id,
        name: therapist.name,
        email: therapist.email || 'doctor@example.com',
        role: 'doctor',
        specialization: therapist.specialization || 'Clinical Psychologist',
        bio: therapist.bio || 'Experienced therapist specializing in various mental health conditions.',
        patients: therapist.patients_count || 0,
        yearsOfExperience: therapist.years_of_experience || 0,
        profileImage: therapist.profile_image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      }));

      setTherapists(formattedTherapists);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error(t('error_loading_therapists'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = searchTerm === "" || 
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === null || 
      therapist.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  const availableSpecializations = [...new Set(therapists.map(t => t.specialization))];

  const handleTherapistSelect = (therapistId: string) => {
    navigate(`/therapist/${therapistId}`);
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 md:mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('find_therapist')}</h1>
          <p className="text-muted-foreground">
            {t('find_therapist_description')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Input
              placeholder={t('search_therapists')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={selectedSpecialization === null ? "default" : "outline"}
              onClick={() => setSelectedSpecialization(null)}
            >
              {t('all_specializations')}
            </Button>
            {availableSpecializations.map(spec => (
              <Button
                key={spec}
                variant={selectedSpecialization === spec ? "default" : "outline"}
                onClick={() => setSelectedSpecialization(spec === selectedSpecialization ? null : spec)}
              >
                {spec}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">{t('no_therapists_found')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map(therapist => (
              <TherapistCard 
                key={therapist.id}
                doctor={therapist}
                onSelect={() => handleTherapistSelect(therapist.id)}
                selected={false}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TherapistSearch;
