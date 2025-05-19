
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon, Clock, Calendar as CalendarCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface Appointment {
  id: string;
  doctor_name: string;
  doctor_id: string;
  session_date: string;
  session_type: string;
  status: string;
}

const AppointmentManager = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const isRTL = language === 'ar';
  const dateLocale = isRTL ? ar : enUS;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, [user, navigate]);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('session_date', { ascending: true });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(t('error_loading_appointments'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    setIsCancelling(true);
    try {
      // Update in supabase
      const { error } = await supabase
        .from('patient_appointments')
        .update({ status: 'cancelled' })
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id ? { ...apt, status: 'cancelled' } : apt
      ));
      
      toast.success(t('appointment_cancelled'));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(t('error_cancelling_appointment'));
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRescheduleAppointment = () => {
    if (!selectedAppointment) return;
    
    // Store the appointment ID in localStorage
    localStorage.setItem('rescheduleAppointmentId', selectedAppointment.id);
    localStorage.setItem('selectedTherapistId', selectedAppointment.doctor_id);
    
    // Navigate to booking page
    navigate('/session-booking');
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PP', { locale: dateLocale });
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'p', { locale: dateLocale });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return "bg-blue-100 text-blue-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('my_appointments')}</h2>

      {isLoading ? (
        <div className="flex flex-col space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-28 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('no_appointments')}</h3>
              <p className="text-muted-foreground mb-4">{t('no_appointments_message')}</p>
              <Button onClick={() => navigate('/therapist-search')}>
                {t('find_a_therapist')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(appointment => (
              <Card key={appointment.id} className={appointment.status === 'cancelled' ? 'opacity-75' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{appointment.doctor_name}</CardTitle>
                    <Badge className={getStatusColor(appointment.status)}>
                      {t(appointment.status.toLowerCase())}
                    </Badge>
                  </div>
                  <CardDescription>{appointment.session_type}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatAppointmentDate(appointment.session_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatAppointmentTime(appointment.session_date)}</span>
                  </div>
                </CardContent>
                {appointment.status === 'upcoming' && (
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsDialogOpen(true);
                        }}
                      >
                        {t('cancel')}
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          handleRescheduleAppointment();
                        }}
                      >
                        {t('reschedule')}
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('cancel_appointment')}</DialogTitle>
                <DialogDescription>
                  {t('cancel_appointment_confirmation')}
                </DialogDescription>
              </DialogHeader>
              {selectedAppointment && (
                <div className="py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">{selectedAppointment.doctor_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.session_type}</p>
                    </div>
                    <Badge className={getStatusColor(selectedAppointment.status)}>
                      {t(selectedAppointment.status.toLowerCase())}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatAppointmentDate(selectedAppointment.session_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatAppointmentTime(selectedAppointment.session_date)}</span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t('keep_appointment')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelAppointment}
                  disabled={isCancelling}
                >
                  {isCancelling ? t('cancelling') : t('confirm_cancel')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default AppointmentManager;
