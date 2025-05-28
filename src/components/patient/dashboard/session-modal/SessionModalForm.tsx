
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/hooks/useLanguage";
import { Form } from "@/components/ui/form";
import { TherapistInfo } from "./TherapistInfo";
import { useSessionForm, SessionFormData } from "./useSessionForm";
import { SessionTypeField } from "./form-fields/SessionTypeField";
import { DatePickerField } from "./form-fields/DatePickerField";
import { TimePickerField } from "./form-fields/TimePickerField";
import { NotesField } from "./form-fields/NotesField";
import { FormActions } from "./form-fields/FormActions";
import {DoctorProfile} from "@/lib/therapist-types";
import { useEffect } from "react";


// Form schema for validation - export it for use in field components
export const formSchema = z.object({
  sessionType: z.string({
    required_error: "Please select a session type",
  }),
  sessionDate: z.date({
    required_error: "Please select a date",
  }),
  sessionTime: z.string({
    required_error: "Please select a time",
  }),
  notes: z.string().optional(),
  doctorId: z.string({ // <-- تم إضافة doctorId
    required_error: "Please select a doctor",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

interface SessionModalFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  onCancel: () => void;
}

export const SessionModalForm = ({ onSubmit, isLoading, setIsLoading, onCancel }: SessionModalFormProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const {
    selectedDoctor,     // كائن الطبيب المختار للعرض
    isLoadingDoctors,
    doctors,
    setSelectedDoctor,  // دالة لتحديث كائن الطبيب المختار في useSessionForm
    availableTimeSlots,
    isLoadingTimeSlots,
    loadAvailableTimeSlots,
  } = useSessionForm({ onClose: onCancel });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 2. تحديث القيم الافتراضية للنموذج
    defaultValues: {
      sessionType: "",
      sessionTime: "",
      notes: "",
      doctorId: "", // <-- إضافة قيمة افتراضية لـ doctorId
    },
    mode: "onSubmit", // أو "onChange" إذا أردت التحقق أثناء الكتابة
  });

    // --- 👇 2. useEffect لمراقبة doctorId و sessionDate واستدعاء loadAvailableTimeSlots 👇 ---
  const watchedDoctorId = form.watch('doctorId');
  const watchedSessionDate = form.watch('sessionDate');

  useEffect(() => {
    if (watchedDoctorId && watchedSessionDate) {
        console.log("SessionModalForm - Calling loadAvailableTimeSlots with:", watchedDoctorId, watchedSessionDate);

      // عندما يتم اختيار طبيب وتاريخ، قم بجلب الأوقات المتاحة
      loadAvailableTimeSlots(watchedDoctorId, watchedSessionDate);
      // قد ترغب في مسح sessionTime المختار سابقًا عند تغيير الطبيب أو التاريخ
      form.setValue('sessionTime', ''); 
    } else {
      // إذا لم يتم اختيار طبيب أو تاريخ، لا توجد أوقات لعرضها
      // يمكنك هنا مسح availableTimeSlots إذا أردت (عادةً ما يتم ذلك في loadAvailableTimeSlots)
    }
  }, [watchedDoctorId, watchedSessionDate, loadAvailableTimeSlots, form.setValue]);
  
  // Handle form submission
  const handleFormSubmit = async (values: FormValues) => { // values الآن تحتوي على doctorId
    try {
      setIsLoading(true);
      // onSubmit تتوقع الآن SessionFormData التي تحتوي على doctorId
      await onSubmit({
        sessionDate: values.sessionDate,
        sessionTime: values.sessionTime,
        sessionType: values.sessionType,
        notes: values.notes || "",
        doctorId: values.doctorId, // <-- تمرير doctorId
      });
    } catch (error) {
        console.error("Error submitting form from SessionModalForm:", error);      // setIsLoading(false) سيتم التعامل معها في finally block الخاص بـ onSubmit (handleBookSession)
    } 
  };
  const isTimePickerDisabledByForm = !watchedDoctorId || !watchedSessionDate || isLoadingTimeSlots;

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        {/* 5. تمرير الخصائص اللازمة إلى TherapistInfo */}
        <TherapistInfo
          doctors={doctors}
          isLoading={isLoadingDoctors}
          // doctorObject={selectedDoctor} // هذا لعرض تفاصيل الطبيب المختار (إذا كان TherapistInfo يفعل ذلك)
          selectedDoctorIdFromForm={watchedDoctorId} // القيمة الحالية لـ doctorId من النموذج
        // دالة يتم استدعاؤها عند اختيار طبيب
          onDoctorChange={(selectedId, selectedObject) => { 
            form.setValue('doctorId', selectedId, { shouldValidate: true });
            }}
          />

        {/* باقي حقول النموذج */}
        <SessionTypeField control={form.control} />
        <DatePickerField control={form.control} />
        <TimePickerField 
          control={form.control} 
          availableSlots={availableTimeSlots} // قائمة الأوقات المتاحة (HH:MM:SS)
          isLoadingSlots={isLoadingTimeSlots} // حالة تحميل الأوقات
          disabled={isTimePickerDisabledByForm} // تعطيل الحقل إذا لم يتم اختيار طبيب/تاريخ أو أثناء التحميل
        />
        <NotesField control={form.control} />
        <FormActions isLoading={isLoading} onCancel={onCancel} />
      </form>
    </Form>
  );
};