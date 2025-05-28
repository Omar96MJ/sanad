
import { supabase } from "@/integrations/supabase/client";
import { DoctorProfile } from "@/lib/therapist-types";  


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
  console.log("Fetching and synchronizing all doctors...");

  try {
    // 1. جلب الأطباء الموجودين حاليًا من جدول 'doctors'
    const { data: existingDoctorsData, error: doctorsError } = await supabase
      .from("doctors")
      .select("id, user_id, name, specialization, bio, profile_image, patients_count, years_of_experience, weekly_available_hours") // تحديد الأعمدة
      .order("name");

    if (doctorsError) {
      console.error("Error fetching from doctors table:", doctorsError.message);
      // في حالة الخطأ هنا، قد ترغب في إرجاع مصفوفة فارغة أو رمي الخطأ
      // بدلًا من المتابعة ببيانات قد تكون غير مكتملة.
      // لكن منطقك الحالي هو المتابعة، لذلك سنبقيه حاليًا.
    }
    const existingDoctors = existingDoctorsData || [];
    console.log("Existing doctors from doctors table:", existingDoctors);

    // 2. جلب المستخدمين الذين لديهم دور 'doctor' من جدول 'profiles'
    const { data: doctorProfilesData, error: profilesError } = await supabase
      .from("profiles")
      // حدد الأعمدة التي تحتاجها فقط من 'profiles'
      // (مثال: id, name, email, profile_image, وأي حقول أخرى قد تستخدمها للمزامنة)
      .select("id, name, email, profile_image") // افترض أن 'id' هنا هو user_id
      .eq("role", "doctor");

    if (profilesError) {
      console.error("Error fetching doctor profiles from profiles table:", profilesError.message);
      // إذا فشل جلب ملفات تعريف الأطباء، سنرجع قائمة الأطباء الموجودين حاليًا بعد تحويلها
      return existingDoctors.map(doc => ({
        id: doc.id,
        user_id: doc.user_id,
        name: doc.name,
        specialization: doc.specialization ?? "Default Specialization",
        bio: doc.bio ?? "No bio available",
        profile_image: doc.profile_image ?? "default_avatar_url.png",
        patients_count: doc.patients_count ?? 0, // <--- تم التصحيح
        years_of_experience: doc.years_of_experience ?? 0,
        weekly_available_hours: doc.weekly_available_hours ?? 0,
      }));
    }
    const doctorProfiles = doctorProfilesData || [];
    console.log("Doctor profiles found from profiles table:", doctorProfiles);

    if (doctorProfiles.length === 0) {
      console.log("No doctor profiles found in profiles table. Returning existing doctors from doctors table.");
      // إذا لم يتم العثور على أي ملفات تعريف أطباء، ارجع القائمة الحالية من جدول doctors
      return existingDoctors.map(doc => ({
        id: doc.id,
        user_id: doc.user_id,
        name: doc.name,
        specialization: doc.specialization ?? "Default Specialization",
        bio: doc.bio ?? "No bio available",
        profile_image: doc.profile_image ?? "default_avatar_url.png",
        patients_count: doc.patients_count ?? 0, // <--- تم التصحيح
        years_of_experience: doc.years_of_experience ?? 0,
        weekly_available_hours: doc.weekly_available_hours ?? 0,
      }));
    }

    // 3. تجهيز بيانات الأطباء لعملية Upsert
    const existingDoctorsMap = new Map(existingDoctors.map(doc => [doc.user_id, doc]));
    const doctorsToUpsert = doctorProfiles.map(profile => {
      const existingDoctor = existingDoctorsMap.get(profile.id); // نفترض profile.id هو user_id
      
      const doctorDataForUpsert = {
        user_id: profile.id, // هذا هو user_id من جدول profiles
        name: profile.name || `Dr. ${profile.email?.split('@')[0] || profile.id.substring(0,6)}`,
        // القيم الافتراضية هنا مهمة إذا كان DoctorProfile يتطلبها وهي ليست في profile
        // أو إذا أردت استخدام قيم existingDoctor كقاعدة
        specialization: existingDoctor?.specialization ?? "Mental Health Specialist", // يمكنك استخدام القيمة الافتراضية من DB إذا فضلت
        bio: existingDoctor?.bio ?? "Dedicated professional.",       // قيمة افتراضية
        profile_image: profile.profile_image || existingDoctor?.profile_image /* ?? "default_avatar_url.png" */, // قد تفضل عدم وضع افتراضي هنا والاعتماد على DB أو null
        patients_count: existingDoctor?.patients_count ?? 0,        // <--- تم التصحيح
        years_of_experience: existingDoctor?.years_of_experience ?? 0, // قيمة افتراضية
        weekly_available_hours: existingDoctor?.weekly_available_hours ?? 0, // <-- تم الإضافة
        // إذا كان 'id' موجودًا (لتحديث سجل موجود)، قم بتضمينه
        ...(existingDoctor && { id: existingDoctor.id })
      };
      return doctorDataForUpsert;
    });

    console.log("Upserting doctors:", doctorsToUpsert);

    // 4. تنفيذ عملية Upsert
    const { data: upsertedDoctorsData, error: upsertError } = await supabase
      .from("doctors")
      .upsert(doctorsToUpsert, {
        onConflict: 'user_id', // التأكد من أن هذا القيد موجود وفريد في جدول doctors
        ignoreDuplicates: false, // أو true حسب ما تريد. false يعني أنه سيقوم بالتحديث.
      })
      // حدد الأعمدة اللازمة لـ DoctorProfile
      .select("id, user_id, name, specialization, bio, profile_image, patients_count, years_of_experience, weekly_available_hours");

    if (upsertError) {
      console.error("Error upserting doctor records:", upsertError.message);
      // في حالة فشل Upsert، ارجع قائمة الأطباء الموجودين قبل محاولة Upsert
      return existingDoctors.map(doc => ({
        id: doc.id,
        user_id: doc.user_id,
        name: doc.name,
        specialization: doc.specialization ?? "Default Specialization",
        bio: doc.bio ?? "No bio available",
        profile_image: doc.profile_image ?? "default_avatar_url.png",
        patients_count: doc.patients_count ?? 0, // <--- تم التصحيح
        years_of_experience: doc.years_of_experience ?? 0,
        weekly_available_hours: doc.weekly_available_hours ?? 0,
      }));
    }
    const upsertedDoctors = upsertedDoctorsData || [];
    console.log("Successfully upserted doctors:", upsertedDoctors);

    // 5. تحويل قائمة الأطباء (بعد Upsert) إلى DoctorProfile[]
    return upsertedDoctors.map(doc => ({
      id: doc.id,
      user_id: doc.user_id,
      name: doc.name,
      specialization: doc.specialization ?? "Default Specialization",
      bio: doc.bio ?? "No bio available",
      profile_image: doc.profile_image ?? "default_avatar_url.png",
      patients_count: doc.patients_count ?? 0, // <--- تم التصحيح
      years_of_experience: doc.years_of_experience ?? 0,
      weekly_available_hours: doc.weekly_available_hours ?? 0,
    }));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error in fetchAllDoctors";
    console.error("Error in fetchAllDoctors:", errorMessage);
    return []; // إرجاع مصفوفة فارغة في حالة أي خطأ غير متوقع
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