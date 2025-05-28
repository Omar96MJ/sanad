
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AvailabilitySlot {
  id?: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export const useAvailability = (doctorId: string | null) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAvailability = async () => {
    if (!doctorId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('therapist_availability')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('day_of_week')
        .order('start_time');

      if (error) {
        console.error("Error fetching availability:", error);
        toast.error("Failed to load availability data");
        return;
      }

      setAvailability(data || []);
    } catch (error) {
      console.error("Error in fetchAvailability:", error);
      toast.error("Failed to load availability data");
    } finally {
      setIsLoading(false);
    }
  };

  const saveAvailability = async (newAvailability: AvailabilitySlot[]) => {
    if (!doctorId) {
      toast.error("Doctor ID is required");
      return false;
    }

    setIsSaving(true);
    try {
      // Delete all existing availability for this doctor
      const { error: deleteError } = await supabase
        .from('therapist_availability')
        .delete()
        .eq('doctor_id', doctorId);

      if (deleteError) {
        console.error("Error deleting old availability:", deleteError);
        toast.error("Failed to update availability");
        setIsSaving(false);
        return false;
      }

      // Insert new availability slots
      if (newAvailability.length > 0) {
        const slotsToInsert = newAvailability.map(slot => ({
          doctor_id: doctorId, // التأكد من doctorId الصحيح
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: true // بما أن newAvailability تمثل الخانات المفعلة
        }));

        const { error: insertError } = await supabase
          .from('therapist_availability')
          .insert(slotsToInsert);

        if (insertError) {
          console.error("Error inserting new availability:", insertError);
          toast.error("Failed to save availability");
          setIsSaving(false);
          return false;
        }
      }

      const totalWeeklyHours = newAvailability.filter(slot => slot.is_available === true).length;

      const { error: updateDoctorError } = await supabase
        .from('doctors')
        .update({ weekly_available_hours: totalWeeklyHours })
        .eq('id', doctorId); // نفترض أن doctorId هنا هو الـ ID من جدول doctors

      if (updateDoctorError) {
        console.error("Error updating doctor's weekly_available_hours:", updateDoctorError);
        // يمكنك إظهار تحذير هنا أن تفاصيل التوفر تم حفظها ولكن تحديث الإحصائية فشل
        toast.warning("Availability details saved, but weekly hours statistic update failed.");
        // مع ذلك، العملية الأساسية (حفظ التوفر) نجحت، لذا قد لا نرغب في إرجاع false بالكامل
      } else {
        console.log(`Updated weekly_available_hours for doctor ${doctorId} to ${totalWeeklyHours}`);
      }


      await fetchAvailability(); // Refresh data
      toast.success("Availability updated successfully");
      return true;
    } catch (error) {
      console.error("Error in saveAvailability:", error);
      toast.error("Failed to save availability");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
   if (doctorId) { // تأكد من جلب التوفر فقط إذا كان doctorId موجودًا
        fetchAvailability();
    } else {
        setAvailability([]); // مسح التوفر إذا لم يكن هناك doctorId
        setIsLoading(false);
    }
  }, [doctorId]);

  return {
    availability,
    isLoading,
    isSaving,
    saveAvailability,
    refetch: fetchAvailability
  };
};
