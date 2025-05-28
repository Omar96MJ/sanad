
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import TherapistRegister from './pages/TherapistRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import Blog from './pages/Blog';
import FAQ from './pages/FAQ';
import SelfCareTips from './pages/SelfCareTips';
import MentalHealthGuide from './pages/MentalHealthGuide';
import CrisisSupport from './pages/CrisisSupport';
import Donation from './pages/Donation';
import PatientDashboard from './pages/PatientDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PsychologicalTests from './pages/PsychologicalTests';
import Profile from './pages/Profile';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/hooks/useTheme';
import { LanguageProvider } from '@/hooks/language';
import { AuthProvider } from '@/hooks/useAuth';
import CreateAdmin from './pages/CreateAdmin';

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/therapist-register" element={<TherapistRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/self-care-tips" element={<SelfCareTips />} />
              <Route path="/mental-health-guide" element={<MentalHealthGuide />} />
              <Route path="/crisis-support" element={<CrisisSupport />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/therapist-dashboard/*" element={<TherapistDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/tests" element={<PsychologicalTests />} />
              <Route path="/psychological-tests" element={<PsychologicalTests />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/create-admin" element={<CreateAdmin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster closeButton position="top-center" />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
