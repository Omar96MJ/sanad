
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { createAppointment, PatientAppointment } from "@/services/patientAppointmentService";
import { fetchAllDoctors, fetchAvailableTimeSlots } from "@/services/doctorService";
import { DoctorProfile } from "@/lib/therapist-types";
import { format, isValid, parseISO } from 'date-fns';
import { useCallback } from 'react';
export interface SessionFormData {
   sessionDate: Date | undefined;
  sessionTime: string;
  sessionType: string;
  notes: string;
  doctorId: string; 
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
  // selectedDoctor لا يزال مفيدًا لعرض تفاصيل الطبيب المختار في الواجهة (داخل Modal)
  // ويتم تحديثه بواسطة setSelectedDoctor التي ستُمرر من SessionModalForm إلى TherapistInfo
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]); // ستخزن 'HH:MM:SS'
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  // 2. تعديل useEffect لجلب الأطباء وإزالة الاختيار التلقائي
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        console.log("Loading doctors for session form...");
        // استدعاء fetchAllDoctors المحدثة (مع الأخذ في الاعتبار آثارها الجانبية Upsert)
        const doctorsData = await fetchAllDoctors();
        console.log("Doctors loaded for session form:", doctorsData);
        setDoctors(doctorsData);

        // إزالة الاختيار التلقائي للطبيب الأول
        setSelectedDoctor(null); // ابدأ دائمًا بدون طبيب محدد
        if (doctorsData.length === 0) {
          console.log("No doctors available for selection");
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
        toast.error(isRTL ? "حدث خطأ أثناء تحميل بيانات الأطباء" : "Error loading doctors data");
        setSelectedDoctor(null);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    if (user) { // قد ترغب في جلب الأطباء فقط إذا كان المستخدم مسجلاً دخوله
        loadDoctors();
    }
  }, [user, isRTL]); // أضفت user كإعتمادية، قد تحتاج لمراجعتها حسب منطقك

  const loadAvailableTimeSlots = useCallback(async (doctorIdForSlots: string, sessionDateForSlots: Date | undefined) => {
  if (!doctorIdForSlots || !sessionDateForSlots || !isValid(sessionDateForSlots)) {
    setAvailableTimeSlots([]);
    return;
  }
  setIsLoadingTimeSlots(true);
  setAvailableTimeSlots([]);
  try {
    const dateStringYYYYMMDD = format(sessionDateForSlots, 'yyyy-MM-dd');
    const slots = await fetchAvailableTimeSlots(doctorIdForSlots, dateStringYYYYMMDD); // دالة الخدمة
    setAvailableTimeSlots(slots);
  } catch (error) {
    console.error("Error fetching available time slots in hook:", error);
    toast.error(isRTL ? "خطأ في جلب الأوقات المتاحة" : "Error fetching available slots");
    setAvailableTimeSlots([]);
  } finally {
    setIsLoadingTimeSlots(false);
  }
}, [isRTL]);

  // 3. تعديل دالة handleBookSession
  const handleBookSession = async (formValues: SessionFormData) => { // formValues الآن تحتوي على doctorId
    setIsLoading(true);
    try {
      // التأكد من وجود doctorId ضمن الحقول المطلوبة
      if (!user || !formValues.sessionDate || !formValues.sessionTime || !formValues.sessionType || !formValues.doctorId) {
        toast.error(isRTL ? "يرجى تعبئة جميع الحقول المطلوبة، بما في ذلك اختيار الطبيب" : "Please fill in all required fields, including selecting a doctor");
        setIsLoading(false);
        return;
      }

      // لا حاجة لمنطق doctorToUse السابق، doctorId يأتي مباشرة من النموذج
      // selectedDoctor (كائن) يُستخدم لعرض تفاصيل الطبيب في الواجهة (TherapistInfo)
      // و TherapistInfo هو الذي سيقوم بتحديث حقل doctorId في النموذج (عبر form.setValue)
      // وفي نفس الوقت يمكنه استدعاء setSelectedDoctor لتحديث هذا الكائن للعرض

      const sessionDateTime = new Date(formValues.sessionDate);
      const [hours, minutes] = formValues.sessionTime.split(':').map(Number);
      sessionDateTime.setHours(hours, minutes, 0, 0);

      // تجهيز البيانات لدالة createAppointment بالصيغة الجديدة المتوقعة
      // نوع البيانات المتوقع من createAppointment هو CreateAppointmentPayload
      // وهو Omit<PatientAppointment, 'id' | 'created_at' | 'updated_at' | 'doctor'>
      const appointmentDataForService = {
        patient_id: user.id,
        doctor_id: formValues.doctorId, // <-- استخدام doctorId من النموذج
        session_date: sessionDateTime.toISOString(),
        session_type: formValues.sessionType,
        status: 'scheduled' as PatientAppointment['status'], // <-- استخدام status صحيح ('scheduled')
        notes: formValues.notes, // <-- تمرير الملاحظات
        // لا يوجد doctor_name هنا
      };

      // استدعاء دالة createAppointment المحدثة
      // والتي سترجع PatientAppointment مع doctor:null
      await createAppointment(appointmentDataForService);

      toast.success(
        isRTL
          ? "تم حجز جلستك بنجاح!"
          : "Your session has been booked successfully!"
      );

      onClose(); // إغلاق النافذة المنبثقة
      if (onSessionBooked) {
        onSessionBooked(); // تحديث قائمة المواعيد في الواجهة الرئيسية
      }
    } catch (error) {
      console.error("Error booking session in useSessionForm:", error);
      // الدوال الخدمية (مثل createAppointment) تقوم الآن بإظهار رسائل toast عند حدوث أخطاء معينة من Supabase.
      // يمكننا هنا إظهار رسالة toast عامة للأخطاء الأخرى أو إذا لم تقم الدالة الخدمية بذلك.
      const errorMessage = error instanceof Error ? error.message : "";
      // تجنب تكرار رسائل الـ toast إذا كانت الخدمة قد عرضت واحدة بالفعل
      // هذه مجرد محاولة بسيطة لتجنب التكرار، قد تحتاج لتحسينها
      if (!errorMessage.includes("فشل إنشاء الموعد") && 
          !errorMessage.includes("بيانات الموعد غير كاملة") &&
          !errorMessage.includes("Missing required appointment data") && // هذه رسالة من useSessionForm نفسها
          !errorMessage.includes("Failed to create appointment or retrieve created data") ) {
         toast.error(
           isRTL
             ? "حدث خطأ أثناء حجز الجلسة. يرجى المحاولة مرة أخرى."
             : "An error occurred while booking your session. Please try again."
         );
      }
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
    selectedDoctor,    // لا يزال مفيدًا لعرض تفاصيل الطبيب المختار في واجهة المستخدم
    setSelectedDoctor, // مهم لـ TherapistInfo لتحديث هذا المتغير وأيضًا لتحديث doctorId في النموذج
    availableTimeSlots,
    isLoadingTimeSlots,
    loadAvailableTimeSlots,
  };
};