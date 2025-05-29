import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseISO, getDay } from "date-fns";
import { format as formatInTimeZone, toZonedTime, fromZonedTime } from "date-fns-tz";
import { DoctorProfile, DoctorAppStatus } from "@/lib/therapist-types"; 

const mapToDoctorProfile = (doc: any): DoctorProfile => ({
  id: doc.id,
  user_id: doc.user_id,
  name: doc.name ?? "Unknown Doctor", // توفير قيمة افتراضية لـ name أيضًا
  specialization: doc.specialization ?? "General", // قيمة افتراضية
  bio: doc.bio ?? "No bio available.",
  profile_image: doc.profile_image ?? "/default-avatar.png", // مسار لصورة افتراضية
  patients_count: doc.patients_count ?? 0,
  years_of_experience: doc.years_of_experience ?? 0,
  weekly_available_hours: doc.weekly_available_hours ?? 0,
  status: doc.status as DoctorAppStatus | null ?? null, // ✅ التأكد من أن status يُعالج ويُعين
});

// Define the application's timezone
const APP_TIME_ZONE_OFFSET_HOURS = 2; 
const APP_TIME_ZONE = 'africa/khartoum'; // منطقة التوقيت الخاصة بالتطبيق


export const fetchAvailableTimeSlots = async (
  doctorId: string,
  selectedDateString: string // e.g., "2025-06-02"
): Promise<string[]> => {
  console.log("SERVICE_LOG_1: fetchAvailableTimeSlots called with:", { doctorId, selectedDateString });

  if (!doctorId || !selectedDateString) {
    console.error("SERVICE_LOG_ERROR: Doctor ID and selected date are required.");
    return [];
  }

  try {
    // 2. حساب dayOfWeek بشكل صحيح للتاريخ المحدد في منطقة الطبيب الزمنية
    const startDateInKhartoum = fromZonedTime(selectedDateString, APP_TIME_ZONE, { timeZone: APP_TIME_ZONE });
      console.log("SERVICE_LOG_2: startDateInKhartoum (Date object for dayOfWeek calc):", startDateInKhartoum.toISOString(), startDateInKhartoum.toString());

    // 3. احصل على يوم الأسبوع من هذا الكائن (الذي يمثل بداية اليوم في الخرطوم)
    const dayOfWeek = getDay(startDateInKhartoum); // 0 for Sunday, 1 for Monday, ...
    console.log("SERVICE_LOG_3: Calculated dayOfWeek:", dayOfWeek);


    // ... (باقي الكود لجلب potentialSlotsData كما هو، باستخدام dayOfWeek الجديد) ...
    const { data: potentialSlotsData, error: availabilityError } = await supabase
      .from('therapist_availability')
      .select('start_time')
      .eq('doctor_id', doctorId)
      .eq('day_of_week', dayOfWeek) // <--- سيستخدم dayOfWeek المحسوب بالطريقة الجديدة
      .eq('is_available', true)
      .order('start_time');

    if (availabilityError) {
      console.error("SERVICE_LOG_ERROR: Supabase error fetching therapist_availability:", availabilityError);
      return [];
    }
    console.log("SERVICE_LOG_4: Data from therapist_availability (potentialSlotsData):", potentialSlotsData);


    if (!potentialSlotsData || potentialSlotsData.length === 0) {
      console.log("SERVICE_LOG_INFO: No potential availability slots found in therapist_availability for this doctor/day.");

      return [];
    }
    const potentialStartTimes: string[] = potentialSlotsData.map(slot => slot.start_time);
    console.log("SERVICE_LOG_5: Potential start times from therapist_availability (mapped):", potentialStartTimes);

    // 4. جلب المواعيد المحجوزة بالفعل للطبيب في التاريخ المحدد
    //    نحتاج لتحديد بداية ونهاية اليوم المحدد بالتوقيت العالمي المنسق (UTC)
    //    بناءً على المنطقة الزمنية للتطبيق (APP_TIME_ZONE)
    const dayStartInAppZoneAsUTC = fromZonedTime(`${selectedDateString}T00:00:00`, APP_TIME_ZONE);
    const dayEndInAppZoneAsUTC = fromZonedTime(`${selectedDateString}T23:59:59.999`, APP_TIME_ZONE);
    
    const { data: bookedAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('session_date') // هذا timestamptz (مخزن كـ UTC)
      .eq('doctor_id', doctorId)
      .in('status', ['scheduled', 'rescheduled'])
      .gte('session_date', dayStartInAppZoneAsUTC.toISOString())
      .lt('session_date', dayEndInAppZoneAsUTC.toISOString()); // أو .lte إذا أردت تضمين 23:59:59.999

    if (appointmentsError) {
      console.error("SERVICE_LOG_ERROR: Error fetching booked appointments:", appointmentsError.message);
      return []; 
    }
    console.log("SERVICE_LOG_6: Raw bookedAppointments data from DB:", bookedAppointments);


    const bookedStartTimesLocal = new Set<string>();
    if (bookedAppointments && bookedAppointments.length > 0) {
      bookedAppointments.forEach(appt => {
       if (appt.session_date) {
        const sessionDateUTC = parseISO(appt.session_date); // يمثل مثلاً 06:00:00Z

            // --- 👇 بداية الحل اليدوي المؤقت 👇 ---
            const utcHours = sessionDateUTC.getUTCHours();
            const utcMinutes = sessionDateUTC.getUTCMinutes();
            const utcSeconds = sessionDateUTC.getUTCSeconds();

            let khartoumHour = utcHours + APP_TIME_ZONE_OFFSET_HOURS; // APP_TIME_ZONE_OFFSET_HOURS = 2
            
            // معالجة تجاوز اليوم (نادر الحدوث إذا كان APP_TIME_ZONE_OFFSET_HOURS صغيرًا)
            if (khartoumHour >= 24) {
                khartoumHour -= 24; 
            } else if (khartoumHour < 0) { // في حالة المناطق الزمنية السالبة (غير حالتنا)
                khartoumHour += 24;
            }
            
            const manuallyFormattedKhartoumTime = 
                `${khartoumHour.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:${utcSeconds.toString().padStart(2, '0')}`;
            
            console.log("FETCH_DEBUG_MANUAL: DB UTC String:", appt.session_date, "=> Manually Formatted Khartoum Time:", manuallyFormattedKhartoumTime);
            // --- 👆 نهاية الحل اليدوي المؤقت 👆 ---

            bookedStartTimesLocal.add(manuallyFormattedKhartoumTime);
          }// استخدام الوقت المنسق الجديد
      });
    }
    console.log("SERVICE_LOG_7: Processed booked start times (local to app timezone):", Array.from(bookedStartTimesLocal)); // هذا هو السجل الذي أعطيتني إياه

    // 5. فلترة الخانات الزمنية المحتملة لإزالة المحجوزة
    const availableTimeSlots = potentialStartTimes.filter(
      slotStartTime => !bookedStartTimesLocal.has(slotStartTime)
    );
    console.log("SERVICE_LOG_8: Final available slots being returned:", availableTimeSlots);

    return availableTimeSlots;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("SERVICE_LOG_EXCEPTION: Exception in fetchAvailableTimeSlots:", errorMessage);
    return [];
  }
};

export const fetchDoctorById = async (doctorId: string): Promise<DoctorProfile | null> => {
  console.log("Fetching doctor with ID:", doctorId);

  const { data, error } = await supabase
    .from("doctors")
    // من الأفضل تحديد الأعمدة التي تحتاجها بالضبط لتتناسب مع DoctorProfile
    .select("id, user_id, name, specialization, bio, profile_image, patients_count, years_of_experience, weekly_available_hours")
    .eq("id", doctorId)
    .single();

  if (error) {
    console.error("Error fetching doctor by ID:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  console.log("Doctor data fetched by ID:", data);
  // التأكد من تحويل البيانات ومطابقتها مع DoctorProfile
  // مع التعامل مع القيم الافتراضية إذا كانت الحقول في DoctorProfile تتطلب قيمًا وليست null
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    specialization: data.specialization ?? "Default Specialization", // أو أي قيمة افتراضية أو معالجة أخرى
    bio: data.bio ?? "No bio available",
    profile_image: data.profile_image ?? "default_image_url.jpg", // مثال لقيمة افتراضية
    patients_count: data.patients_count ?? 0, // <--- *** تم التصحيح *** واستخدام قيمة افتراضية
    years_of_experience: data.years_of_experience ?? 0,
    weekly_available_hours: data.weekly_available_hours ?? 0,
  };
};

export const fetchDoctorByUserId = async (userId: string): Promise<DoctorProfile | null> => {
  console.log("Fetching doctor with user_id:", userId);

  const { data, error } = await supabase
    .from("doctors")
    .select("id, user_id, name, specialization, bio, profile_image, patients_count, years_of_experience, weekly_available_hours")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching doctor by user_id:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  console.log("Doctor data fetched by user_id:", data);
  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    specialization: data.specialization ?? "Default Specialization",
    bio: data.bio ?? "No bio available",
    profile_image: data.profile_image ?? "default_image_url.jpg",
    patients_count: data.patients_count ?? 0, // <--- *** تم التصحيح ***
    years_of_experience: data.years_of_experience ?? 0,
    weekly_available_hours: data.weekly_available_hours ?? 0,
  };
};

export const fetchAllDoctors = async (): Promise<DoctorProfile[]> => {
  console.log("Fetching and synchronizing all doctors, filtering for 'approved' status...");

  try {
    // 1. جلب الأطباء الموجودين حاليًا مع حقل status
    const { data: existingDoctorsData, error: doctorsError } = await supabase
      .from("doctors")
      .select("id, user_id, name, specialization, bio, profile_image, patients_count, years_of_experience, weekly_available_hours, status") // ✅ 'status' مضافة هنا
      .order("name");

    if (doctorsError) {
      console.error("Error fetching from doctors table:", doctorsError.message);
      // في حالة الخطأ، نُرجع مصفوفة فارغة لأننا لا نستطيع ضمان صحة البيانات
      return []; 
    }
    const existingDoctors = existingDoctorsData || [];

    // 2. جلب المستخدمين الذين لديهم دور 'doctor' من جدول 'profiles'
    const { data: doctorProfilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, name, email, profile_image") 
      .eq("role", "doctor");

    if (profilesError) {
      console.error("Error fetching doctor profiles from profiles table:", profilesError.message);
      // إذا فشل جلب ملفات التعريف، نعتمد على الأطباء الموجودين حاليًا فقط (بعد الفلترة)
      return existingDoctors.map(mapToDoctorProfile).filter(doc => doc.status === 'approved');
    }
    const doctorProfilesFromProfilesTable = doctorProfilesData || [];

    if (doctorProfilesFromProfilesTable.length === 0 && existingDoctors.length === 0) {
      console.log("No doctors found in 'doctors' table and no 'doctor' role users in 'profiles' table.");
      return [];
    }

    // 3. مزامنة البيانات: تجهيز بيانات الأطباء لعملية Upsert
    // الهدف هو التأكد من أن كل طبيب في 'profiles' له سجل مطابق في 'doctors'
    const existingDoctorsMapByUserId = new Map(existingDoctors.map(doc => [doc.user_id, doc]));
    
    const doctorsToUpsert = doctorProfilesFromProfilesTable.map(profile => {
      const existingDoctorRecord = existingDoctorsMapByUserId.get(profile.id);
      return {
        user_id: profile.id, // هذا هو auth.users.id
        name: profile.name || `Dr. ${profile.email?.split('@')[0] || profile.id.substring(0,6)}`,
        profile_image: profile.profile_image || existingDoctorRecord?.profile_image, // استخدم صورة البروفايل من profiles أولاً
        // القيم الافتراضية للحقول الأخرى إذا لم يكن الطبيب موجودًا في جدول 'doctors'
        specialization: existingDoctorRecord?.specialization ?? "General Psychiatrist",
        bio: existingDoctorRecord?.bio ?? "No bio yet",
        years_of_experience: existingDoctorRecord?.years_of_experience ?? 0,
        patients_count: existingDoctorRecord?.patients_count ?? 0,
        weekly_available_hours: existingDoctorRecord?.weekly_available_hours ?? 0,
        // لا نقوم بتعيين 'status' هنا أثناء الـ upsert إلا إذا كان هناك منطق محدد لذلك
        // سيعتمد على القيمة الافتراضية في قاعدة البيانات ('pending') للسجلات الجديدة
        // أو سيحتفظ بالقيمة الحالية للسجلات الموجودة
        ...(existingDoctorRecord && { id: existingDoctorRecord.id }) // لتحديث السجل الموجود بدلاً من إنشاء جديد إذا كان id موجودًا
      };
    }).filter(doc => doc.user_id); // التأكد من أن user_id موجود

    if (doctorsToUpsert.length > 0) {
        // 4. تنفيذ عملية Upsert
        const { error: upsertError } = await supabase
        .from("doctors")
        .upsert(doctorsToUpsert, { onConflict: 'user_id', ignoreDuplicates: false });

        if (upsertError) {
        console.error("Error upserting doctor records:", upsertError.message);
        // في حالة فشل الـ upsert، لا يزال بإمكاننا محاولة إرجاع الأطباء الموجودين المعتمدين
        // ولكن قد تكون البيانات غير محدثة بالكامل
        return existingDoctors.map(mapToDoctorProfile).filter(doc => doc.status === 'approved');
        }
    }
    
    // 5. جلب جميع الأطباء مرة أخرى بعد عملية المزامنة (Upsert) للتأكد من أننا نحصل على أحدث البيانات بما في ذلك status
    const { data: finalDoctorsData, error: finalDoctorsError } = await supabase
      .from("doctors")
      .select("id, user_id, name, specialization, bio, profile_image, patients_count, years_of_experience, weekly_available_hours, status") // ✅ 'status' مضافة هنا
      .order("name");

    if (finalDoctorsError) {
        console.error("Error fetching final list of doctors after upsert:", finalDoctorsError.message);
        return []; // إرجاع فارغ في حالة الخطأ
    }

    const allDoctorsAfterSync = finalDoctorsData || [];

    // 6. تحويل وفلترة قائمة الأطباء النهائية
    const approvedDoctors = allDoctorsAfterSync
                            .map(mapToDoctorProfile)
                            .filter(doc => doc.status === 'approved');
    
    console.log(`Fetched ${approvedDoctors.length} approved doctor(s).`);
    return approvedDoctors;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error in fetchAllDoctors";
    console.error("Error in fetchAllDoctors:", errorMessage);
    return []; // إرجاع مصفوفة فارغة في حالة حدوث أي خطأ غير متوقع
  }
};

// Function to ensure a doctor record exists for a user
export const ensureDoctorRecord = async (userId: string, userName: string): Promise<DoctorProfile | null> => {
  console.log("Ensuring doctor record exists for user:", userId, userName);

  // 1. التحقق مما إذا كان سجل الطبيب موجودًا بالفعل
  //    نفترض أن fetchDoctorByUserId تم تعديلها بشكل صحيح
  const existingDoctor = await fetchDoctorByUserId(userId);
  if (existingDoctor) {
    console.log("Doctor record already exists:", existingDoctor);
    return existingDoctor;
  }

  // 2. إذا لم يكن موجودًا، قم بإنشاء سجل جديد
  console.log("Creating new doctor record for user:", userId);
  const { data, error } = await supabase
    .from("doctors")
    .insert({
      user_id: userId,
      name: userName || `Doctor ${userId.substring(0, 6)}`, // اسم افتراضي أفضل قليلاً
      // الحقول التالية يمكن أن تعتمد على القيم الافتراضية في قاعدة البيانات
      // أو يمكنك تحديدها هنا إذا أردت تجاوز القيم الافتراضية لقاعدة البيانات
      // specialization: "Mental Health Specialist", // إذا لم تحدد، ستأخذ القيمة الافتراضية من DB
      // bio: "Experienced mental health professional", // نفس الملاحظة
      patients_count: 0,                         // <--- *** تم التصحيح ***
      // years_of_experience: 5,               // نفس الملاحظة
      // profile_image: "default_image_url.jpg", // نفس الملاحظة
      // weekly_available_hours: 0,            // نفس الملاحظة
    })
    // حدد الأعمدة التي تحتاجها لتكوين DoctorProfile، خاصة تلك التي لها قيم افتراضية في DB
    .select("id, user_id, name, specialization, bio, profile_image, patients_count, years_of_experience, weekly_available_hours")
    .single();

  if (error) {
    console.error("Error creating doctor record:", error.message);
    return null;
  }

  if (!data) {
    console.error("No data returned after creating doctor record.");
    return null;
  }

  console.log("Created new doctor record (raw):", data);

  // 3. تحويل البيانات المُرجعة إلى نوع DoctorProfile
  //    مع التعامل مع القيم الافتراضية للحقول المطلوبة في DoctorProfile
  const newDoctorProfile: DoctorProfile = {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    specialization: data.specialization ?? "Default Specialization", // قيمة افتراضية إذا كانت DB تُرجع null
    bio: data.bio ?? "No bio available",
    profile_image: data.profile_image ?? "default_avatar_url.png", // مثال لقيمة افتراضية
    patients_count: data.patients_count ?? 0,       // <--- *** تم التصحيح ***
    years_of_experience: data.years_of_experience ?? 0,
    weekly_available_hours: data.weekly_available_hours ?? 0,
  };

  console.log("Mapped new doctor profile:", newDoctorProfile);
  return newDoctorProfile;
};
