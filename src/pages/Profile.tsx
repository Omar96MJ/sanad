
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TherapistProfile from "@/components/therapist/TherapistProfile";
import AdminProfile from "@/components/admin/AdminProfile";
import PatientProfile from "@/components/patient/PatientProfile";

const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      navigate("/login");
    }
    
    window.scrollTo(0, 0);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow mt-16 md:mt-20 py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
          </h1>
          
          {user.role === 'doctor' && <TherapistProfile />}
          {user.role === 'admin' && <AdminProfile />}
          {user.role === 'patient' && <PatientProfile />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
