
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { LanguageProvider } from "@/hooks/useLanguage";
import { SettingsProvider } from "@/hooks/useSettings";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TherapistDashboard from "./pages/TherapistDashboard";
import PsychologicalTests from "./pages/PsychologicalTests";
import SessionBooking from "./pages/SessionBooking";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import React from "react";

// Create QueryClient outside of component render
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have the required role, redirect to their dashboard
    if (user.role === 'doctor') {
      return <Navigate to="/therapist-dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/patient-dashboard" replace />;
    }
  }
  
  return children;
};

// Dashboard selector route
const DashboardRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'doctor') {
    return <Navigate to="/therapist-dashboard" replace />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  } else {
    return <Navigate to="/patient-dashboard" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/patient-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/therapist-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <TherapistDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <TherapistDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/psychological-tests" element={<PsychologicalTests />} />
      <Route path="/book-session" element={<SessionBooking />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <LanguageProvider>
              <SettingsProvider>
                <AuthProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <AppRoutes />
                  </TooltipProvider>
                </AuthProvider>
              </SettingsProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
