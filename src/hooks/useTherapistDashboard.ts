
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DoctorProfile } from "@/lib/therapist-types";

type Appointment = {
  id: string;
  patient_id: string;
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
};

type DemographicItem = {
  name: string;
  percentage: number;
};

export const useTherapistDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [doctorStats, setDoctorStats] = useState({
    patients_count: 0,
    upcoming_sessions: 0,
    pending_evaluations: 0,
    available_hours: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [demographics, setDemographics] = useState<DemographicItem[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate("/login", { replace: true });
      toast({ variant: "destructive", title: t('error'), description: t('unauthorized_access') });
      return;
    }

    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);

        // Fetch doctor profile
        const { data: profileData, error: profileError } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching doctor profile:", profileError);
          toast({ variant: "destructive", title: t('error'), description: t('error_loading_profile') });
          if (profileError.code === 'PGRST116') {
            setIsLoading(false);
            return;
          }
          setIsLoading(false);
          return;
        }

        if (profileData) {
          const currentDoctorProfile: DoctorProfile = {
            id: profileData.id,
            user_id: profileData.user_id,
            name: profileData.name,
            specialization: profileData.specialization,
            bio: profileData.bio,
            years_of_experience: profileData.years_of_experience,
            patients_count: 0,
            profile_image: profileData.profile_image,
            weekly_available_hours: profileData.weekly_available_hours || 0,
          };
          setDoctorProfile(currentDoctorProfile);

          const stats = {
            patients_count: 0,
            upcoming_sessions: 0,
            pending_evaluations: 0,
            available_hours: currentDoctorProfile.weekly_available_hours,
          };

          // Fetch patient count
          const { count: patientCountData, error: patientCountError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('assigned_doctor_id', currentDoctorProfile.id)
            .eq('role', 'patient');

          if (!patientCountError && patientCountData !== null) {
            stats.patients_count = patientCountData;
            currentDoctorProfile.patients_count = patientCountData;
            setDoctorProfile(currentDoctorProfile);
          } else if (patientCountError) {
            console.error("Error fetching patient count:", patientCountError);
          }

          // Fetch upcoming appointments
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
            .eq('doctor_id', currentDoctorProfile.id)
            .in('status', ['scheduled', 'rescheduled'])
            .order('session_date', { ascending: true })
            .limit(3);

          if (!appointmentsError && appointmentsData) {
            stats.upcoming_sessions = appointmentsData.length;
            
            setUpcomingAppointments(appointmentsData.map(appt => ({
              id: appt.id,
              patient_id: appt.patient_id,
              doctor_id: currentDoctorProfile.id,
              session_date: appt.session_date,
              session_type: appt.session_type,
              status: appt.status,
              notes: appt.notes,
              patient: appt.patient ? {
                id: appt.patient.id,
                name: appt.patient.name || t('unknown_patient'),
                profile_image: appt.patient.profile_image
              } : { name: t('unknown_patient'), id: appt.patient_id }
            })) as Appointment[]);
          } else if (appointmentsError) {
            console.error("Error fetching upcoming appointments:", appointmentsError.message);
            setUpcomingAppointments([]);
          }

          // Fetch pending evaluations count
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

          setDoctorStats(stats);

          // Fetch notifications count
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

          // Fetch unread messages count
          const { data: unreadConvData, error: unreadConvError } = await supabase
            .from('conversation_participants')
            .select('unread_count')
            .eq('user_id', user.id);

          if (!unreadConvError && unreadConvData) {
            const totalUnreadMessages = unreadConvData.reduce((sum, item) => sum + (item.unread_count || 0), 0);
            setUnreadMessagesCount(totalUnreadMessages);
          } else if (unreadConvError) {
            console.error("Error fetching unread messages count:", unreadConvError.message);
            setUnreadMessagesCount(0);
          }

          // Fetch demographics
          const processedDemographics: DemographicItem[] = [];
          if (stats.patients_count > 0) {
            const { data: diagnosisData, error: diagnosisError } = await supabase
              .from('patient_diagnoses')
              .select('condition_tag, patient_id')
              .eq('doctor_id', currentDoctorProfile.id);

            if (!diagnosisError && diagnosisData) {
              const countsByTag = diagnosisData.reduce((acc: { [key: string]: Set<string> }, { condition_tag, patient_id }) => {
                if (!acc[condition_tag]) {
                  acc[condition_tag] = new Set<string>();
                }
                acc[condition_tag].add(patient_id);
                return acc;
              }, {});

              const predefinedDbTags = ['anxiety', 'depression', 'stress'];
              let accountedPercentageSum = 0;

              for (const tag of predefinedDbTags) {
                const distinctPatientCountForTag = countsByTag[tag] ? countsByTag[tag].size : 0;
                const percentage = Math.round((distinctPatientCountForTag / stats.patients_count) * 100);
                processedDemographics.push({
                  name: t(tag),
                  percentage: percentage,
                });
                accountedPercentageSum += percentage;
              }

              let otherPercentage = 100 - accountedPercentageSum;
              otherPercentage = Math.max(0, otherPercentage);
              if (accountedPercentageSum + otherPercentage > 100 && otherPercentage > 0) {
                otherPercentage = 100 - accountedPercentageSum;
                otherPercentage = Math.max(0, otherPercentage);
              }

              processedDemographics.push({
                name: t('other'),
                percentage: otherPercentage,
              });

            } else if (diagnosisError) {
              console.error("Error fetching diagnosis data for demographics:", diagnosisError);
              const fallbackTags = ['anxiety', 'depression', 'stress', 'other'];
              fallbackTags.forEach(tag => processedDemographics.push({ name: t(tag), percentage: 0 }));
            }
          } else {
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

    if (user && user.id) {
      fetchDoctorData();
    } else {
      setIsLoading(false);
    }

    window.scrollTo(0, 0);
  }, [user, navigate, t, toast]);

  return {
    isLoading,
    doctorProfile,
    notificationsCount,
    unreadMessagesCount,
    doctorStats,
    upcomingAppointments,
    demographics,
  };
};
