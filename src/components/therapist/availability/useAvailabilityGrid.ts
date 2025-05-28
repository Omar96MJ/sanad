
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
    
    for (let day = 0; day < tempGrid.length; day++) {
      let start = -1;
      
      for (let hour = 0; hour <= tempGrid[day].length; hour++) {
        const isAvailable = hour < tempGrid[day].length ? tempGrid[day][hour] : false;
        
        if (isAvailable && start === -1) {
          start = hour;
        } else if (!isAvailable && start !== -1) {
          newAvailability.push({
            doctor_id: doctorId,
            day_of_week: day,
            start_time: `${(start + 8).toString().padStart(2, '0')}:00`,
            end_time: `${(hour + 8).toString().padStart(2, '0')}:00`,
            is_available: true
          });
          start = -1;
        }
      }
    }
    
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
