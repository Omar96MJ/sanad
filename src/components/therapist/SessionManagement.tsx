import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Appointment } from "@/lib/therapist-types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, FileText, Bell } from "lucide-react";

const mockAppointments: Appointment[] = [
  {
    id: '1',
    therapistId: '1',
    patientId: '1',
    patientName: 'John Smith',
    date: '2023-10-29',
    time: '10:00',
    duration: 60,
    status: 'scheduled'
  },
  {
    id: '2',
    therapistId: '1',
    patientId: '2',
    patientName: 'Emma Johnson',
    date: '2023-11-01',
    time: '14:00',
    duration: 45,
    status: 'scheduled'
  },
  {
    id: '3',
    therapistId: '1',
    patientId: '3',
    patientName: 'Michael Brown',
    date: '2023-11-03',
    time: '11:30',
    duration: 60,
    status: 'scheduled'
  }
];

const mockPatients = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Emma Johnson' },
  { id: '3', name: 'Michael Brown' },
  { id: '4', name: 'Sarah Williams' },
  { id: '5', name: 'David Lee' }
];

const SessionManagement = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showSessionNotes, setShowSessionNotes] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  
  const [newAppointmentPatient, setNewAppointmentPatient] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("09:00");
  const [newAppointmentDuration, setNewAppointmentDuration] = useState("60");
  
  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  
  const dayAppointments = mockAppointments.filter(
    appointment => appointment.date === formattedDate
  );
  
  const handleSubmitNotes = () => {
    if (!sessionNotes.trim()) {
      toast.error(t('session_notes_required'));
      return;
    }
    
    toast.success(t('session_notes_submitted'));
    setSessionNotes("");
    setShowSessionNotes(false);
  };
  
  const handleAddAppointment = () => {
    if (!newAppointmentPatient) {
      toast.error(t('select_patient'));
      return;
    }
    
    toast.success(t('appointment_added'));
    setShowAddAppointment(false);
    
    setNewAppointmentPatient("");
    setNewAppointmentTime("09:00");
    setNewAppointmentDuration("60");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {t('session_calendar')}
            </CardTitle>
            <CardDescription>{t('select_date_to_view_sessions')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-3 pointer-events-auto"
              classNames={{
                day_selected: "bg-primary text-primary-foreground",
              }}
            />
            <div className="mt-4">
              <Button 
                className="w-full" 
                onClick={() => setShowAddAppointment(true)}
              >
                {t('add_appointment')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('daily_schedule')}
            </CardTitle>
            <CardDescription>
              {date ? format(date, 'PPPP') : t('no_date_selected')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('no_appointments_for_day')}
              </div>
            ) : (
              <div className="space-y-4">
                {dayAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-muted/40">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{appointment.patientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time} ({appointment.duration} min)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowSessionNotes(true);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            {t('add_notes')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast.success(t('notification_sent'));
                            }}
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            {t('notify')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedAppointment && (
        <Dialog open={showSessionNotes} onOpenChange={setShowSessionNotes}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('session_notes')}: {selectedAppointment.patientName}</DialogTitle>
              <DialogDescription>
                {format(new Date(`${selectedAppointment.date}T${selectedAppointment.time}`), 'PPP')} at {selectedAppointment.time}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder={t('enter_session_notes')}
                className="min-h-32"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSessionNotes(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleSubmitNotes}>
                {t('submit_notes')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={showAddAppointment} onOpenChange={setShowAddAppointment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('add_new_appointment')}</DialogTitle>
            <DialogDescription>
              {date ? format(date, 'PPP') : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('patient')}</label>
              <Select
                value={newAppointmentPatient}
                onValueChange={setNewAppointmentPatient}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('select_patient')} />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('time')}</label>
              <Select
                value={newAppointmentTime}
                onValueChange={setNewAppointmentTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('select_time')} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </SelectItem>
                  ))}
                  {Array.from({ length: 9 }, (_, i) => i + 9).map(hour => (
                    <SelectItem key={`${hour}-30`} value={`${hour}:30`}>
                      {hour}:30
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('duration')}</label>
              <Select
                value={newAppointmentDuration}
                onValueChange={setNewAppointmentDuration}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('select_duration')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 {t('minutes')}</SelectItem>
                  <SelectItem value="45">45 {t('minutes')}</SelectItem>
                  <SelectItem value="60">60 {t('minutes')}</SelectItem>
                  <SelectItem value="90">90 {t('minutes')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAppointment(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleAddAppointment}>
              {t('add_appointment')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionManagement;
