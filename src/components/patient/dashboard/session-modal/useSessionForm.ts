
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { createAppointment } from "@/services/patientAppointmentService";

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
  
  const [formData, setFormData] = useState<SessionFormData>({
    sessionDate: undefined,
    sessionTime: "",
    sessionType: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock doctor data
  const mockDoctor = {
    id: "dr-smith",
    name: "Dr. Emily Smith",
    specialization: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      sessionDate: undefined,
      sessionTime: "",
      sessionType: "",
      notes: ""
    });
  };

  // Handle booking session
  const handleBookSession = async (formValues: SessionFormData) => {
    if (!user || !formValues.sessionDate || !formValues.sessionTime || !formValues.sessionType) {
      toast.error(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Combine date and time
      const [hours, minutes] = formValues.sessionTime.split(':').map(Number);
      const sessionDateTime = new Date(formValues.sessionDate);
      sessionDateTime.setHours(hours, minutes, 0, 0);
      
      await createAppointment({
        patient_id: user.id,
        doctor_id: mockDoctor.id,
        doctor_name: mockDoctor.name,
        session_date: sessionDateTime.toISOString(),
        session_type: formValues.sessionType,
        status: 'upcoming'
      });
      
      toast.success(
        isRTL 
          ? "تم حجز جلستك بنجاح!" 
          : "Your session has been booked successfully!"
      );
      
      // Reset form and close dialog
      resetForm();
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
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    handleBookSession,
    resetForm,
    mockDoctor,
  };
};
