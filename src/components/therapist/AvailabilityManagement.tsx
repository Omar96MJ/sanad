
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAvailability } from "@/hooks/useAvailability";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityGrid } from "./availability/AvailabilityGrid";
import { AvailabilitySummary } from "./availability/AvailabilitySummary";
import { AvailabilityActions } from "./availability/AvailabilityActions";
import { useAvailabilityGrid } from "./availability/useAvailabilityGrid";

interface AvailabilityManagementProps {
  doctorId?: string;
}

const AvailabilityManagement = ({ doctorId }: AvailabilityManagementProps) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';
  
  // Get doctor ID from props or fetch from current user
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(doctorId || null);
  
  // Fetch doctor ID if not provided
  useState(() => {
    if (!doctorId && user) {
      const fetchDoctorId = async () => {
        const { data, error } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setCurrentDoctorId(data.id);
        }
      };
      fetchDoctorId();
    }
  });

  const { availability, isLoading, isSaving, saveAvailability } = useAvailability(currentDoctorId);
  
  const {
    currentGrid,
    editMode,
    startEdit,
    cancelEdit,
    toggleSlot,
    convertGridToAvailability
  } = useAvailabilityGrid(availability);

  const handleSaveChanges = async () => {
    if (!currentDoctorId) {
      console.error("No doctor ID available");
      return;
    }

    const newAvailability = convertGridToAvailability(currentDoctorId);
    const success = await saveAvailability(newAvailability);
    if (success) {
      cancelEdit();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('loading')}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {t('availability_management')}
            </div>
            <AvailabilityActions
              editMode={editMode}
              isSaving={isSaving}
              onStartEdit={startEdit}
              onSaveChanges={handleSaveChanges}
              onCancelEdit={cancelEdit}
            />
          </CardTitle>
          <CardDescription>
            {editMode ? t('click_to_toggle_availability') : t('view_your_availability')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityGrid
            currentGrid={currentGrid}
            editMode={editMode}
            onSlotToggle={toggleSlot}
          />
          
          <AvailabilitySummary availability={availability} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityManagement;
