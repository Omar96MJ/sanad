import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { PatientAppointment, updateAppointmentStatus } from "@/services/patientAppointmentService";
import { toast } from "sonner";

interface AppointmentsTabProps {
  appointments: PatientAppointment[];
  onBookAppointment: () => void;
  formatAppointmentDate: (dateString: string) => string;
  formatAppointmentTime: (dateString: string) => string;
  onAppointmentUpdated: () => void;
  isLoading?: boolean;
}

export const AppointmentsTab = ({
  appointments,
  onBookAppointment,
  formatAppointmentDate,
  formatAppointmentTime,
  onAppointmentUpdated,
  isLoading = false
}: AppointmentsTabProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [isReschedulingId, setIsReschedulingId] = useState<string | null>(null);
  const [reschedulingDate, setReschedulingDate] = useState<Date | undefined>(undefined);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<PatientAppointment | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Handle rescheduling dialog open
  const handleRescheduleClick = (appointment: PatientAppointment) => {
    setReschedulingAppointment(appointment);
    setReschedulingDate(new Date(appointment.session_date));
    setIsReschedulingId(appointment.id!);
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setIsReschedulingId(null);
    setReschedulingAppointment(null);
    setReschedulingDate(undefined);
  };
  
  // Handle reschedule confirm
  const handleRescheduleConfirm = async () => {
    if (!reschedulingDate || !reschedulingAppointment || !isReschedulingId) {
      return;
    }
    
    try {
      setProcessingId(isReschedulingId);
      
      // Keep the time part from original date and just change the date part
      const originalDate = new Date(reschedulingAppointment.session_date);
      const newDate = new Date(reschedulingDate);
      newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds());
      
      await updateAppointmentStatus(
        isReschedulingId, 
        'upcoming',
        newDate.toISOString()
      );
      
      toast.success(isRTL ? "تم إعادة جدولة الموعد بنجاح" : "Appointment rescheduled successfully");
      
      // Close the dialog and refresh data
      handleDialogClose();
      onAppointmentUpdated();
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء إعادة جدولة الموعد" : "Error rescheduling appointment");
      console.error("Error rescheduling appointment:", error);
    } finally {
      setProcessingId(null);
    }
  };
  
  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setProcessingId(appointmentId);
      
      await updateAppointmentStatus(appointmentId, 'cancelled');
      
      toast.success(isRTL ? "تم إلغاء الموعد بنجاح" : "Appointment cancelled successfully");
      onAppointmentUpdated();
    } catch (error) {
      toast.error(isRTL ? "حدث خطأ أثناء إلغاء الموعد" : "Error cancelling appointment");
      console.error("Error cancelling appointment:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Card className="border border-border/50" dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>{t('your_appointments')}</CardTitle>
          <Button onClick={onBookAppointment} className="btn-primary">
            {t('schedule_new_session')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">{t('upcoming')}</h3>
              {appointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
                <div className="space-y-3">
                  {appointments
                    .filter(apt => apt.status === 'upcoming')
                    .map(apt => (
                      <div 
                        key={apt.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-lg p-4"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                              {isRTL ? (apt.session_type === 'Video Call' ? 'مكالمة فيديو' : 'جلسة علاج') : apt.session_type}
                            </div>
                            <Badge variant="outline">{t('upcoming')}</Badge>
                          </div>
                          <p className="font-medium">{formatAppointmentDate(apt.session_date)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatAppointmentTime(apt.session_date)} {isRTL ? 'مع' : 'with'} {apt.doctor_name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full"
                            onClick={() => handleRescheduleClick(apt)}
                            disabled={!!processingId}
                          >
                            {processingId === apt.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : t('reschedule')}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="rounded-full"
                            onClick={() => handleCancelAppointment(apt.id!)}
                            disabled={!!processingId}
                          >
                            {processingId === apt.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : t('cancel')}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t('no_upcoming_sessions')}</p>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">{t('past_appointments')}</h3>
              {appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled').length > 0 ? (
                <div className="space-y-3">
                  {appointments
                    .filter(apt => apt.status === 'completed' || apt.status === 'cancelled')
                    .map(apt => (
                      <div 
                        key={apt.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border/50 rounded-lg p-4"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-medium">
                              {isRTL ? (apt.session_type === 'Video Call' ? 'مكالمة فيديو' : 'جلسة علاج') : apt.session_type}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "bg-muted",
                                apt.status === 'cancelled' && "bg-destructive/10 text-destructive border-destructive/20"
                              )}
                            >
                              {apt.status === 'completed' ? t('completed') : t('cancelled')}
                            </Badge>
                          </div>
                          <p className="font-medium">{formatAppointmentDate(apt.session_date)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatAppointmentTime(apt.session_date)} {isRTL ? 'مع' : 'with'} {apt.doctor_name}
                          </p>
                        </div>
                        {apt.status === 'completed' && (
                          <div>
                            <Button variant="outline" size="sm" className="rounded-full">
                              {t('view_notes')}
                            </Button>
                          </div>
                        )}
                        {apt.status === 'cancelled' && (
                          <div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-full"
                              onClick={() => handleRescheduleClick(apt)}
                              disabled={!!processingId}
                            >
                              {processingId === apt.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : t('reschedule')}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t('no_past_appointments')}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Reschedule Dialog */}
      <Dialog open={isReschedulingId !== null} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'إعادة جدولة الموعد' : 'Reschedule Appointment'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isRTL ? 'اختر تاريخًا جديدًا' : 'Select a new date'}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !reschedulingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reschedulingDate ? format(reschedulingDate, "PPP") : (
                      <span>{isRTL ? 'اختر تاريخًا' : 'Pick a date'}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={reschedulingDate}
                    onSelect={setReschedulingDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDialogClose} disabled={!!processingId}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleRescheduleConfirm} 
              disabled={!reschedulingDate || !!processingId}
            >
              {processingId ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isRTL ? 'جاري المعالجة...' : 'Processing...'}
                </>
              ) : (
                isRTL ? 'تأكيد' : 'Confirm'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
