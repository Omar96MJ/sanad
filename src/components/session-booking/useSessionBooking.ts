
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";

// Mock data for therapists
const mockTherapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    username: "sarah-johnson",
    bio: "Specializing in anxiety and depression treatment with 8+ years of experience",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
    eventTypes: [
      { id: "1", title: "Initial Consultation", length: 60 },
      { id: "2", title: "Follow-up Session", length: 45 },
      { id: "3", title: "Emergency Session", length: 30 }
    ]
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael@example.com",
    username: "michael-chen",
    bio: "Helping families build stronger relationships for over 10 years",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256",
    eventTypes: [
      { id: "1", title: "Family Therapy Session", length: 60 },
      { id: "2", title: "Follow-up Session", length: 45 }
    ]
  },
  {
    id: "3",
    name: "Dr. Aisha Rahman",
    email: "aisha@example.com",
    username: "aisha-rahman",
    bio: "Specialized in PTSD and trauma recovery with a compassionate approach",
    avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256",
    eventTypes: [
      { id: "1", title: "Trauma Therapy", length: 60 },
      { id: "2", title: "Follow-up Session", length: 45 }
    ]
  }
];

interface UseSessionBookingProps {
  onSuccess?: () => void;
  inDashboard?: boolean;
}

export const useSessionBooking = ({ onSuccess, inDashboard = false }: UseSessionBookingProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === "ar";

  const [therapists, setTherapists] = useState(mockTherapists);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [selectedTherapistDetails, setSelectedTherapistDetails] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [eventTypeId, setEventTypeId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Set mock therapists
  useEffect(() => {
    setLoadingTherapists(true);
    // Simulate API call
    setTimeout(() => {
      setTherapists(mockTherapists);
      setLoadingTherapists(false);
    }, 500);
  }, []);

  // Fetch therapist details when selection changes
  useEffect(() => {
    if (selectedTherapist) {
      const therapist = therapists.find(t => t.id === selectedTherapist);
      setSelectedTherapistDetails(therapist || null);
      
      // Reset related fields
      setEventTypeId("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setAvailableSlots([]);
    } else {
      setSelectedTherapistDetails(null);
    }
  }, [selectedTherapist, therapists]);

  // Generate available slots when date changes
  useEffect(() => {
    const generateMockAvailability = async () => {
      if (!selectedTherapist || !eventTypeId || !selectedDate) return;

      setLoadingSlots(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const today = new Date();
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      // Generate mock slots based on date
      const mockSlots = [];
      
      // Morning slots
      mockSlots.push({ date: dateString, slots: [
        { startTime: "09:00", endTime: "10:00" },
        { startTime: "10:00", endTime: "11:00" },
        { startTime: "11:00", endTime: "12:00" },
      ]});
      
      // Afternoon slots - fewer if it's today (pretend some are booked)
      if (isSameDay(selectedDate, today)) {
        mockSlots.push({ date: dateString, slots: [
          { startTime: "14:00", endTime: "15:00" },
        ]});
      } else {
        mockSlots.push({ date: dateString, slots: [
          { startTime: "14:00", endTime: "15:00" },
          { startTime: "15:00", endTime: "16:00" },
          { startTime: "16:00", endTime: "17:00" },
        ]});
      }
      
      setAvailableSlots(mockSlots);
      setLoadingSlots(false);
    };

    if (selectedTherapist && eventTypeId && selectedDate) {
      generateMockAvailability();
    }
  }, [selectedTherapist, eventTypeId, selectedDate]);

  // Handle therapist selection
  const handleTherapistChange = (therapistId: string) => {
    setSelectedTherapist(therapistId);
    setEventTypeId("");
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  // Handle event type selection
  const handleEventTypeChange = (typeId: string) => {
    setEventTypeId(typeId);
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  // Handle booking session
  const handleBookSession = async () => {
    if (!selectedTherapist || !eventTypeId || !selectedDate || !selectedTime) {
      toast.error(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error(isRTL ? "يجب تسجيل الدخول لحجز جلسة" : "You must be logged in to book a session");
      return;
    }

    setLoading(true);

    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        isRTL 
          ? "تم حجز جلستك بنجاح! سنرسل لك تأكيدًا عبر البريد الإلكتروني." 
          : "Your session has been booked successfully! We'll send you a confirmation email."
      );
      
      // Reset form
      setSelectedTherapist("");
      setSelectedTherapistDetails(null);
      setEventTypeId("");
      setSelectedDate(undefined);
      setSelectedTime("");
      setNotes("");
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // If in dashboard, no need to navigate
      if (!inDashboard) {
        navigate("/patient-dashboard");
      }
      
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء حجز الجلسة" : "Error booking your session");
    } finally {
      setLoading(false);
    }
  };

  // Find available time slots for the selected date
  const timeSlots = selectedDate && availableSlots.length > 0
    ? availableSlots
        .find(day => day.date === format(selectedDate, 'yyyy-MM-dd'))
        ?.slots.map((slot: any) => slot.startTime) || []
    : [];

  return {
    therapists,
    selectedTherapist,
    selectedTherapistDetails,
    eventTypeId,
    selectedDate,
    selectedTime,
    notes,
    loading,
    loadingTherapists,
    loadingSlots,
    availableSlots,
    timeSlots,
    handleTherapistChange,
    handleEventTypeChange,
    handleBookSession,
    setSelectedDate,
    setSelectedTime,
    setNotes
  };
};
