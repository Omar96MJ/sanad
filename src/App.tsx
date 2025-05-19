
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import { AuthProvider } from "@/hooks/auth";
import { LanguageProvider } from "@/hooks/language";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PatientDashboard from "./pages/PatientDashboard";
import TherapistDashboard from "./pages/TherapistDashboard";
import TherapistRegistration from "./pages/TherapistRegistration";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect based on user role, similar to previous logic
  React.useEffect(() => {
    if (user && location.pathname === '/login') {
      if (user.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (user.role === 'doctor') {
        navigate('/therapist-dashboard');
      } else if (user.role === 'admin') {
        navigate('/profile');
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:postId" element={<BlogPost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
      <Route path="/therapist-registration" element={<TherapistRegistration />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
