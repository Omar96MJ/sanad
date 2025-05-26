
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TherapistDashboardTabs } from "@/components/therapist/dashboard/TherapistDashboardTabs";
import { DashboardHeader } from "@/components/therapist/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DoctorProfile } from "@/lib/therapist-types"; 
// أنواع البيانات للمواعيد والبيانات الديموغرافية (يمكن تحسينها أو نقلها لملف types)
type Appointment = {
  id: string;
  patient_id: string; // أو object إذا جلبت تفاصيل المريض
  doctor_id: string;
  session_date: string;
  session_type: string;
  status: string;
  notes?: string;
  
  patient?: {
    id?: string;
    name?: string;
    profile_image?: string;
  };
  // يمكنك إضافة حقل patient_name هنا بعد عمل JOIN إذا أردت
};

type DemographicItem = {
  name: string;
  percentage: number;
};


const TherapistDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [doctorStats, setDoctorStats] = useState({
    patients_count: 0,
    upcoming_sessions: 0,
    pending_evaluations: 0,
    available_hours: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [demographics, setDemographics] = useState<DemographicItem[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate("/login", { replace: true }); // استخدام replace: true أفضل هنا
      toast({ variant: "destructive", title: t('error'), description: t('unauthorized_access') });
      return;
    }

    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);

        // 1. جلب الملف الشخصي للطبيب من جدول 'doctors'
        const { data: profileData, error: profileError } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching doctor profile:", profileError);
          toast({ variant: "destructive", title: t('error'), description: t('error_loading_profile') });
          // منطق إنشاء الملف الشخصي التلقائي (إذا كنت لا تزال تريده هنا)
          if (profileError.code === 'PGRST116') { // لم يتم العثور على صف
            // ... (كود إنشاء الملف الشخصي للطبيب، ثم إعادة الجلب أو استخدام البيانات المُنشأة)
            // هذا الجزء معقد وقد يكون من الأفضل التعامل معه في عملية on-boarding منفصلة للطبيب
            // إذا لم يتمكن من إنشاء ملف شخصي، يجب إيقاف التحميل وإظهار خطأ أو توجيه
             setIsLoading(false);
             return;
          }
          setIsLoading(false);
          return;
        }

        if (profileData) {
          const currentDoctorProfile: DoctorProfile = {
            id: profileData.id,
            name: profileData.name,
            specialization: profileData.specialization,
            bio: profileData.bio,
            years_of_experience: profileData.years_of_experience,
            patients_count: 0, // سيتم حسابه لاحقًا
            profile_image: profileData.profile_image,
            weekly_available_hours: profileData.weekly_available_hours || 0,
          };
          setDoctorProfile(currentDoctorProfile);

          // تهيئة كائن الإحصائيات
          const stats = {
            patients_count: 0, // سيتم حسابه
            upcoming_sessions: 0,
            pending_evaluations: 0,
            available_hours: currentDoctorProfile.weekly_available_hours,
          };

          // 2. حساب patients_count للطبيب الحالي
          const { count: patientCountData, error: patientCountError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_doctor_id', currentDoctorProfile.id)
            .eq('role', 'patient');

          if (!patientCountError && patientCountData !== null) {
            stats.patients_count = patientCountData;
            currentDoctorProfile.patients_count = patientCountData; // تحديثه في ملف الطبيب أيضًا إذا أردت تمريره ككل
            setDoctorProfile(currentDoctorProfile); // إعادة تعيين ملف الطبيب بالعدد المحدث
          } else if (patientCountError) {
            console.error("Error fetching patient count:", patientCountError);
          }
 // 3. جلب المواعيد القادمة (وتحديث upcoming_sessions)
          const { data: appointmentsData, error: appointmentsError } = await supabase
            .from('appointments')
            .select(`
              id,
              session_date,
              session_type,
              status,
              notes,
              patient_id,
               patient:profiles!appointments_patient_id_fkey (
                id,
                name,
                profile_image
              )
            `)
            .eq('doctor_id', currentDoctorProfile.id) // currentDoctorProfile يجب أن يكون معرفًا
            .in('status', ['scheduled', 'rescheduled'])
            .order('session_date', { ascending: true })
            .limit(3);

          if (!appointmentsError && appointmentsData) {
            stats.upcoming_sessions = appointmentsData.length; //  أو العدد الكلي إذا تم حسابه بشكل منفصل
            
            setUpcomingAppointments(appointmentsData.map(appt => ({
              id: appt.id,
              patient_id: appt.patient_id, //  معرف المريض من جدول المواعيد
              doctor_id: currentDoctorProfile.id, //  معرف الطبيب من السياق الحالي
              session_date: appt.session_date,
              session_type: appt.session_type,
              status: appt.status,
              notes: appt.notes,
             patient: appt.patient ? {
                id: appt.patient.id,
                name: appt.patient.name || t('unknown_patient'),
                profile_image: appt.patient.profile_image
              } : { name: t('unknown_patient'), id: appt.patient_id }

              // patient_actual_id: appt.patient_profile?.id //  إذا أضفته للنوع وأردت استخدامه
            })) as Appointment[]);
          } else if (appointmentsError) {
            console.error("Error fetching upcoming appointments:", appointmentsError.message);
            setUpcomingAppointments([]);
          }


          // 4. جلب عدد التقييمات المعلقة
          const { count: pendingEvalsCount, error: pendingEvalsError } = await supabase
            .from('evaluations')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', currentDoctorProfile.id)
            .eq('status', 'pending');

          if (!pendingEvalsError && pendingEvalsCount !== null) {
            stats.pending_evaluations = pendingEvalsCount;
          } else if (pendingEvalsError) {
            console.error("Error fetching pending evaluations:", pendingEvalsError);
          }

          setDoctorStats(stats); // تعيين الإحصائيات بعد تجميع كل أجزائها

          // 5. جلب عدد الإشعارات غير المقروءة (للمستخدم المسجل دخوله user.id)
          const { count: notificationsDataCount, error: notificationsError } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_user_id', user.id)
            .eq('is_read', false);

          if (!notificationsError && notificationsDataCount !== null) {
            setNotificationsCount(notificationsDataCount);
          } else if (notificationsError) {
            console.error("Error fetching notifications count:", notificationsError);
          }

           // << *** الخطوة 7: جلب إجمالي عدد الرسائل غير المقروءة للطبيب *** >>
          const { data: unreadConvData, error: unreadConvError } = await supabase
            .from('conversation_participants')
            .select('unread_count')
            .eq('user_id', user.id); // user.id هنا هو الطبيب المسجل دخوله

          if (!unreadConvError && unreadConvData) {
            const totalUnreadMessages = unreadConvData.reduce((sum, item) => sum + (item.unread_count || 0), 0);
            setUnreadMessagesCount(totalUnreadMessages);
          } else if (unreadConvError) {
            console.error("Error fetching unread messages count:", unreadConvError.message);
            setUnreadMessagesCount(0); // قيمة افتراضية في حالة الخطأ
          }

          // 6. جلب البيانات الديموغرافية
          const processedDemographics: DemographicItem[] = [];
          if (stats.patients_count > 0) { // يجب أن يكون عدد المرضى معروفًا لحساب النسب
            const { data: diagnosisData, error: diagnosisError } = await supabase
              .from('patient_diagnoses')
              .select('condition_tag, patient_id') // patient_id لعد المرضى المميزين لكل حالة
              .eq('doctor_id', currentDoctorProfile.id);

            if (!diagnosisError && diagnosisData) {
              const countsByTag = diagnosisData.reduce((acc: { [key: string]: Set<string> }, { condition_tag, patient_id }) => {
                if (!acc[condition_tag]) {
                  acc[condition_tag] = new Set<string>();
                }
                acc[condition_tag].add(patient_id);
                return acc;
              }, {});

              const predefinedDbTags = ['anxiety', 'depression', 'stress']; // يجب أن تتطابق هذه مع القيم في عمود condition_tag
              let accountedPercentageSum = 0;

              for (const tag of predefinedDbTags) {
                const distinctPatientCountForTag = countsByTag[tag] ? countsByTag[tag].size : 0;
                const percentage = Math.round((distinctPatientCountForTag / stats.patients_count) * 100);
                processedDemographics.push({
                  name: t(tag), // تأكد أن لديك ترجمات لهذه الوسوم
                  percentage: percentage,
                });
                accountedPercentageSum += percentage;
              }

              let otherPercentage = 100 - accountedPercentageSum;
              // للتأكد من أن "أخرى" لا تكون سالبة وأن المجموع الكلي قريب من 100%
              otherPercentage = Math.max(0, otherPercentage); 
              // تعديل بسيط لضمان أن المجموع لا يتجاوز 100% بشكل كبير بسبب التقريب
              if (accountedPercentageSum + otherPercentage > 100 && otherPercentage > 0) {
                otherPercentage = 100 - accountedPercentageSum;
                otherPercentage = Math.max(0, otherPercentage); // تأكيد أخير
              }


              processedDemographics.push({
                name: t('other'), // تأكد من ترجمة 'other'
                percentage: otherPercentage,
              });

            } else if (diagnosisError) {
              console.error("Error fetching diagnosis data for demographics:", diagnosisError);
               // في حالة الخطأ، يمكنك تعبئة بقيم صفرية
              const fallbackTags = ['anxiety', 'depression', 'stress', 'other'];
              fallbackTags.forEach(tag => processedDemographics.push({ name: t(tag), percentage: 0 }));
            }
          } else { // لا يوجد مرضى، جميع النسب صفر
            const fallbackTags = ['anxiety', 'depression', 'stress', 'other'];
            fallbackTags.forEach(tag => processedDemographics.push({ name: t(tag), percentage: 0 }));
          }
          setDemographics(processedDemographics);
        }
      } catch (error) {
        console.error("General error in fetchDoctorData:", error);
        toast({ variant: "destructive", title: t('error'), description: t('error_loading_dashboard') });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.id) { // تأكد من وجود user.id قبل بدء الجلب
        fetchDoctorData();
    } else {
        setIsLoading(false); // لا يوجد مستخدم، أوقف التحميل
    }

    window.scrollTo(0, 0);
  }, [user, navigate, t, toast]); // أضف toast إلى مصفوفة الاعتماديات إذا كانت تستخدم بطريقة قد تتغير

  // ... (باقي الكود: معالجات الأحداث، JSX)

  // تأكد من أنك تمرر البيانات المجلوبة بشكل صحيح إلى المكونات الفرعية
  // مثل <DashboardHeader doctorName={doctorProfile?.name || user?.name || ''} ... />
  // و <TherapistDashboardTabs doctorStats={doctorStats} ... />

  if (isLoading && (!user || user.role !== 'doctor')) {
    // إذا كان لا يزال يتم التحقق من المستخدم أو يتم إعادة التوجيه، يمكنك عرض null أو مؤشر تحميل أبسط
    return null; // أو <GlobalLoader />
  }
  
  // إذا لم يكن مستخدمًا أو طبيبًا وتم التعامل مع إعادة التوجيه بالفعل، هذا الشرط للتأكد
  if (!user || user.role !== 'doctor') {
     // useEffect سيتعامل مع إعادة التوجيه، هذا مجرد حارس إضافي
    return null; 
  }


  const handleNotificationClick = () => {
    toast.info(t("notifications_coming_soon"));
  };

  const handleViewSessionDetails = () => {
    setActiveTab("sessions");
  };

  const handleScheduleSession = () => {
    setActiveTab("sessions");
  };

  const handleMessageClick = () => {
    setActiveTab("messages");
  };

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            doctorName={doctorProfile?.name || user.name || ''}
            notificationsCount={notificationsCount}
            unreadMessagesCount={unreadMessagesCount} 
            onMessageClick={handleMessageClick}
            onNotificationClick={handleNotificationClick}
          />
          
          <TherapistDashboardTabs 
            isLoading={isLoading}
            doctorStats={doctorStats}
            upcomingAppointments={upcomingAppointments}
            demographics={demographics}
            onViewSessionDetails={handleViewSessionDetails}
            onScheduleSession={handleScheduleSession}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            doctorProfile={doctorProfile} // افترضنا أن doctorProfile هو اسم الحالة في TherapistDashboard
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapistDashboard;
