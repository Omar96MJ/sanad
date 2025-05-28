
import { useLanguage } from "@/hooks/useLanguage";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorProfile } from "@/lib/therapist-types";


interface TherapistInfoProps {
  doctors: DoctorProfile[]; // قائمة جميع الأطباء لعرضها في القائمة المنسدلة
  isLoading?: boolean;       // لعرض حالة التحميل إذا كانت قائمة الأطباء تُحمَّل
  selectedDoctorIdFromForm: string | null | undefined; // معرّف الطبيب المختار حاليًا في النموذج
  onDoctorChange: (doctorId: string, doctorObject?: DoctorProfile | null) => void; // دالة تُستدعى عند تغيير اختيار الطبيب
  
}

export const TherapistInfo = ({
  doctors,
  isLoading = false,
  selectedDoctorIdFromForm,
  onDoctorChange,
}: TherapistInfoProps) => {
  const { language } = useLanguage();
  const isRTL = language === "ar";

    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDoctorId = event.target.value;
    const selectedDocObject = doctors.find(doc => doc.id === newDoctorId) || null;
    onDoctorChange(newDoctorId, selectedDocObject);
    };

    // إيجاد كائن الطبيب المختار حاليًا لعرض تفاصيله
  const currentSelectedDoctorObject = doctors.find(doc => doc.id === selectedDoctorIdFromForm);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" /> {/* لهيكل عنوان القائمة */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* لهيكل القائمة المنسدلة */}
        <div className="flex gap-3 items-center p-3 bg-muted/30 rounded-lg mt-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      </div>
    );
  }

  // Show fallback message only if no doctors are available at all
  if (!doctors || doctors.length === 0) {
    return (
      <div className="p-3 bg-muted/30 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isRTL ? "لا يوجد أطباء متاحون حاليًا." : "No doctors available at the moment."}
        </p>
      </div>
    );
  }

  // 3. عرض القائمة المنسدلة وتفاصيل الطبيب المختار
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="doctor-select" className="block text-sm font-medium text-foreground mb-1">
          {isRTL ? "اختر المعالج" : "Select Therapist"}
        </label>
        <select
          id="doctor-select"
          value={selectedDoctorIdFromForm || ""} // القيمة الحالية من النموذج
          onChange={handleSelectionChange}
          className="block w-full p-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <option value="" disabled>
            {isRTL ? "-- اختر طبيباً --" : "-- Select a Doctor --"}
          </option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} ({doctor.specialization})
            </option>
          ))}
        </select>
      </div>

      {/* عرض تفاصيل الطبيب المختار إذا تم اختيار طبيب */}
      {currentSelectedDoctorObject && (
        <div className="mt-4 p-3 border rounded-lg bg-muted/30">
          <p className="text-lg font-semibold mb-2">{isRTL ? "المعالج المختار:" : "Selected Therapist:"}</p>
          <div className="flex gap-3 items-center">
            <img
              src={currentSelectedDoctorObject.profile_image || "/default-avatar.png"} // استخدم صورة افتراضية إذا لم تكن متوفرة
              alt={currentSelectedDoctorObject.name}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-md">{currentSelectedDoctorObject.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentSelectedDoctorObject.specialization}
              </p>
              {/* يمكنك إضافة المزيد من التفاصيل هنا إذا أردت، مثل النبذة التعريفية bio */}
              {/* <p className="text-xs text-muted-foreground mt-1">{currentSelectedDoctorObject.bio}</p> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};