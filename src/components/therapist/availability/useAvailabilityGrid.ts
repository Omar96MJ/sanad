
import { useState } from "react";
import { AvailabilitySlot } from "@/hooks/useAvailability";
import { daysOfWeek, timeSlots } from "./constants";

export const useAvailabilityGrid = (availability: AvailabilitySlot[]) => {
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
  const [editMode, setEditMode] = useState(false);

  const startEdit = () => {
    setTempGrid(availabilityGrid.map(row => [...row]));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setTempGrid([]);
  };

  const toggleSlot = (dayIndex: number, hourIndex: number) => {
    if (!editMode) return;
    
    const newGrid = tempGrid.map(row => [...row]);
    newGrid[dayIndex][hourIndex] = !newGrid[dayIndex][hourIndex];
    setTempGrid(newGrid);
  };

  const convertGridToAvailability = (doctorId: string): AvailabilitySlot[] => {
  const newAvailability: AvailabilitySlot[] = [];

  // tempGrid هو الشبكة التي تحتوي على تحديدات الطبيب (true/false لكل خانة)
  tempGrid.forEach((daySlots, dayIndex) => {
    // dayIndex يمثل يوم الأسبوع (0 للأحد، 1 للإثنين، ...)
    daySlots.forEach((isSlotAvailable, hourSlotIndex) => {
      // hourSlotIndex هو مؤشر الخانة الزمنية لهذا اليوم (0 لـ timeSlots[0] وهو "08:00")
      if (isSlotAvailable) { // قم بإنشاء سجل فقط إذا كانت الخانة الزمنية محددة كمتاحة
        
        const startTimeHHMM = timeSlots[hourSlotIndex]; // مثال: "08:00", "09:00", ..., "19:00"

        // 1. تجهيز start_time بالتنسيق الصحيح (HH:MM:SS)
        const formattedStartTime = `${startTimeHHMM}:00`; // مثال: "08:00:00"

        // 2. حساب end_time (بإضافة ساعة واحدة إلى startTime)
        const startHour = parseInt(startTimeHHMM.split(':')[0]); // مثال: 8
        const endHour = startHour + 1;                         // مثال: 9

        // تجهيز end_time بالتنسيق الصحيح (HH:MM:SS)
        // بما أن أقصى قيمة في timeSlots هي "19:00"، فإن أقصى endHour سيكون 20
        // وبالتالي formattedEndTime سيكون "20:00:00"، وهو صالح.
        const formattedEndTime = `${endHour.toString().padStart(2, '0')}:00:00`; // مثال: "09:00:00"

        newAvailability.push({
          doctor_id: doctorId,
          day_of_week: dayIndex, // يطابق مباشرة ترميز قاعدة البيانات (0-6)
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          is_available: true, // بما أننا نمر فقط على الخانات المتاحة
        });
      }
    });
  });
  return newAvailability;
};

  const currentGrid = editMode ? tempGrid : availabilityGrid;

  return {
    currentGrid,
    editMode,
    startEdit,
    cancelEdit,
    toggleSlot,
    convertGridToAvailability
  };
};
