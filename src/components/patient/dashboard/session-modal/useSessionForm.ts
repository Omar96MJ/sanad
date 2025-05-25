
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
        const doctorsData = await fetchAllDoctors();
        setDoctors(doctorsData);
        // Auto-select first doctor if available
        if (doctorsData.length > 0) {
          setSelectedDoctor(doctorsData[0]);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل بيانات الأطباء" : "Error loading doctors data");
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

      if (!selectedDoctor) {
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
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
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
