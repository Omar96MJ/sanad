
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { createAppointment } from "@/services/patientAppointmentService";
import { fetchAllDoctors, DoctorProfile } from "@/services/doctorService";

export interface SessionFormData {
  sessionDate: Date | undefined;
  sessionTime: string;
  sessionType: string;
  notes: string;
}

interface UseSessionFormProps {
  onClose: () => void;
  onSessionBooked?: () => void;
}

export const useSessionForm = ({ onClose, onSessionBooked }: UseSessionFormProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRTL = language === "ar";
  
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);

  // Load doctors on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        console.log("Loading doctors for session form...");
        
        const doctorsData = await fetchAllDoctors();
        console.log("Doctors loaded for session form:", doctorsData);
        
        setDoctors(doctorsData);
        
        // Auto-select first doctor if available
        if (doctorsData.length > 0) {
          setSelectedDoctor(doctorsData[0]);
          console.log("Auto-selected doctor:", doctorsData[0]);
        } else {
          console.log("No doctors available for selection");
          // Set selected doctor to null to show fallback message
          setSelectedDoctor(null);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل بيانات الأطباء" : "Error loading doctors data");
        setSelectedDoctor(null);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [isRTL]);

  // Handle booking session
  const handleBookSession = async (formValues: SessionFormData) => {
    setIsLoading(true);
    
    try {
      if (!user || !formValues.sessionDate || !formValues.sessionTime || !formValues.sessionType) {
        toast.error(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // If no doctor is selected but doctors are available, select the first one
      let doctorToUse = selectedDoctor;
      if (!doctorToUse && doctors.length > 0) {
        doctorToUse = doctors[0];
        setSelectedDoctor(doctorToUse);
      }

      if (!doctorToUse) {
        toast.error(isRTL ? "لا يوجد طبيب متاح حاليًا" : "No doctor available at the moment");
        setIsLoading(false);
        return;
      }

      // Combine date and time
      const [hours, minutes] = formValues.sessionTime.split(':').map(Number);
      const sessionDateTime = new Date(formValues.sessionDate);
      sessionDateTime.setHours(hours, minutes, 0, 0);
      
      await createAppointment({
        patient_id: user.id,
        doctor_id: doctorToUse.id,
        doctor_name: doctorToUse.name,
        session_date: sessionDateTime.toISOString(),
        session_type: formValues.sessionType,
        status: 'upcoming'
      });
      
      toast.success(
        isRTL 
          ? "تم حجز جلستك بنجاح!" 
          : "Your session has been booked successfully!"
      );
      
      // Close dialog
      onClose();
      
      // Refresh appointments list
      if (onSessionBooked) {
        onSessionBooked();
      }
    } catch (error) {
      console.error("Error booking session:", error);
      toast.error(
        isRTL 
          ? "حدث خطأ أثناء حجز الجلسة. يرجى المحاولة مرة أخرى." 
          : "An error occurred while booking your session. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    handleBookSession,
    doctors,
    isLoadingDoctors,
    selectedDoctor,
    setSelectedDoctor,
  };
};
