
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Availability } from "@/lib/therapist-types";
import { Calendar as CalendarIcon, Clock, Check } from "lucide-react";

// Mock availability data
const initialAvailability: Availability[] = [
  { id: '1', therapistId: '1', dayOfWeek: 1, startTime: '09:00', endTime: '12:00', isAvailable: true },
  { id: '2', therapistId: '1', dayOfWeek: 1, startTime: '14:00', endTime: '17:00', isAvailable: true },
  { id: '3', therapistId: '1', dayOfWeek: 2, startTime: '10:00', endTime: '15:00', isAvailable: true },
  { id: '4', therapistId: '1', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { id: '5', therapistId: '1', dayOfWeek: 4, startTime: '14:00', endTime: '18:00', isAvailable: true },
  { id: '6', therapistId: '1', dayOfWeek: 5, startTime: '09:00', endTime: '13:00', isAvailable: true }
];

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
  return `${hour}:00`;
});

const AvailabilityManagement = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [availability, setAvailability] = useState<Availability[]>(initialAvailability);
  const [editMode, setEditMode] = useState(false);
  
  // Create a 2D array to represent the availability grid (days x hours)
  const availabilityGrid = daysOfWeek.map(day => {
    const dayIndex = daysOfWeek.indexOf(day);
    return timeSlots.map(time => {
      const hour = parseInt(time.split(':')[0]);
      const slot = availability.find(a => 
        a.dayOfWeek === dayIndex && 
        parseInt(a.startTime.split(':')[0]) <= hour && 
        parseInt(a.endTime.split(':')[0]) > hour
      );
      return slot ? true : false;
    });
  });
  
  const toggleSlot = (dayIndex: number, hourIndex: number) => {
    if (!editMode) return;
    
    const newGrid = [...availabilityGrid];
    newGrid[dayIndex][hourIndex] = !newGrid[dayIndex][hourIndex];
    
    // Convert grid back to availability array
    const newAvailability: Availability[] = [];
    
    for (let day = 0; day < newGrid.length; day++) {
      let start = -1;
      
      for (let hour = 0; hour < newGrid[day].length; hour++) {
        if (newGrid[day][hour] && start === -1) {
          start = hour;
        } else if (!newGrid[day][hour] && start !== -1) {
          newAvailability.push({
            id: `new-${day}-${start}`,
            therapistId: '1',
            dayOfWeek: day,
            startTime: `${hour + 8 - (hour - start)}:00`,
            endTime: `${hour + 8}:00`,
            isAvailable: true
          });
          start = -1;
        }
      }
      
      // If the day ends with available slots
      if (start !== -1) {
        newAvailability.push({
          id: `new-${day}-${start}`,
          therapistId: '1',
          dayOfWeek: day,
          startTime: `${start + 8}:00`,
          endTime: `${timeSlots.length + 8}:00`,
          isAvailable: true
        });
      }
    }
    
    setAvailability(newAvailability);
  };
  
  const saveAvailability = () => {
    // In a real app, send to backend
    toast.success(t('availability_updated'));
    setEditMode(false);
  };

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
                  <Button variant="outline" onClick={() => {
                    setAvailability(initialAvailability);
                    setEditMode(false);
                  }}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={saveAvailability}>
                    <Check className="h-4 w-4 mr-1" />
                    {t('save_changes')}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setEditMode(true)}>
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
                        h-12 rounded-md border flex items-center justify-center
                        ${availabilityGrid[dayIndex][hourIndex] ? 'bg-primary/20 border-primary/50' : 'bg-muted/20 border-muted/50'}
                        ${editMode ? 'cursor-pointer hover:opacity-80' : ''}
                      `}
                      onClick={() => toggleSlot(dayIndex, hourIndex)}
                    >
                      {availabilityGrid[dayIndex][hourIndex] && (
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
                  const dayAvailability = availability.filter(a => a.dayOfWeek === dayIndex);
                  if (dayAvailability.length === 0) return null;
                  
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <span className="font-medium w-24">{t(day)}:</span>
                      <span>
                        {dayAvailability.map((slot, i) => (
                          <span key={slot.id}>
                            {i > 0 && ", "}
                            {slot.startTime} - {slot.endTime}
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
