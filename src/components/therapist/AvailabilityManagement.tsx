
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAvailability, AvailabilitySlot } from "@/hooks/useAvailability";
import { Calendar as CalendarIcon, Clock, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Starting from 8 AM
  return `${hour.toString().padStart(2, '0')}:00`;
});

interface AvailabilityManagementProps {
  doctorId?: string;
}

const AvailabilityManagement = ({ doctorId }: AvailabilityManagementProps) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === 'ar';
  const [editMode, setEditMode] = useState(false);
  
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
  
  // Create a 2D array to represent the availability grid (days x hours)
  const availabilityGrid = daysOfWeek.map((_, dayIndex) => {
    return timeSlots.map((time) => {
      const hour = parseInt(time.split(':')[0]);
      const slot = availability.find(a => 
        a.day_of_week === dayIndex && 
        parseInt(a.start_time.split(':')[0]) <= hour && 
        parseInt(a.end_time.split(':')[0]) > hour
      );
      return slot ? true : false;
    });
  });
  
  const [tempGrid, setTempGrid] = useState<boolean[][]>([]);
  
  // Initialize temp grid when entering edit mode
  const startEdit = () => {
    setTempGrid(availabilityGrid.map(row => [...row]));
    setEditMode(true);
  };
  
  const toggleSlot = (dayIndex: number, hourIndex: number) => {
    if (!editMode) return;
    
    const newGrid = tempGrid.map(row => [...row]);
    newGrid[dayIndex][hourIndex] = !newGrid[dayIndex][hourIndex];
    setTempGrid(newGrid);
  };
  
  const saveChanges = async () => {
    if (!currentDoctorId) {
      console.error("No doctor ID available");
      return;
    }

    // Convert grid back to availability array
    const newAvailability: AvailabilitySlot[] = [];
    
    for (let day = 0; day < tempGrid.length; day++) {
      let start = -1;
      
      for (let hour = 0; hour <= tempGrid[day].length; hour++) {
        const isAvailable = hour < tempGrid[day].length ? tempGrid[day][hour] : false;
        
        if (isAvailable && start === -1) {
          start = hour;
        } else if (!isAvailable && start !== -1) {
          newAvailability.push({
            doctor_id: currentDoctorId,
            day_of_week: day,
            start_time: `${(start + 8).toString().padStart(2, '0')}:00`,
            end_time: `${(hour + 8).toString().padStart(2, '0')}:00`,
            is_available: true
          });
          start = -1;
        }
      }
    }
    
    const success = await saveAvailability(newAvailability);
    if (success) {
      setEditMode(false);
      setTempGrid([]);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setTempGrid([]);
  };

  const currentGrid = editMode ? tempGrid : availabilityGrid;

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
            <div>
              {editMode ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelEdit} disabled={isSaving}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={saveChanges} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    {t('save_changes')}
                  </Button>
                </div>
              ) : (
                <Button onClick={startEdit}>
                  {t('edit_availability')}
                </Button>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {editMode ? t('click_to_toggle_availability') : t('view_your_availability')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-[100px_repeat(12,1fr)] gap-1 mb-4">
                <div className="font-medium text-center">{t('day')}/{t('time')}</div>
                {timeSlots.map((time, i) => (
                  <div key={i} className="font-medium text-center text-sm">
                    <div className="flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </div>
                  </div>
                ))}
              </div>
              
              {daysOfWeek.map((day, dayIndex) => (
                <div key={day} className="grid grid-cols-[100px_repeat(12,1fr)] gap-1 mb-1">
                  <div className="font-medium flex items-center">
                    {t(day)}
                  </div>
                  {timeSlots.map((_, hourIndex) => (
                    <div 
                      key={hourIndex}
                      className={`
                        h-12 rounded-md border flex items-center justify-center transition-colors
                        ${currentGrid[dayIndex]?.[hourIndex] ? 'bg-primary/20 border-primary/50' : 'bg-muted/20 border-muted/50'}
                        ${editMode ? 'cursor-pointer hover:opacity-80' : ''}
                      `}
                      onClick={() => toggleSlot(dayIndex, hourIndex)}
                    >
                      {currentGrid[dayIndex]?.[hourIndex] && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">{t('current_availability')}:</h3>
            <div className="space-y-2">
              {availability.length === 0 ? (
                <p className="text-muted-foreground">{t('no_availability_set')}</p>
              ) : (
                daysOfWeek.map((day, dayIndex) => {
                  const dayAvailability = availability.filter(a => a.day_of_week === dayIndex);
                  if (dayAvailability.length === 0) return null;
                  
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <span className="font-medium w-24">{t(day)}:</span>
                      <span>
                        {dayAvailability.map((slot, i) => (
                          <span key={slot.id || i}>
                            {i > 0 && ", "}
                            {slot.start_time} - {slot.end_time}
                          </span>
                        ))}
                      </span>
                    </div>
                  );
                }).filter(Boolean)
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityManagement;
