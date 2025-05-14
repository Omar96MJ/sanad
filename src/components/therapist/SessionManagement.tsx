
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { ar, enUS } from 'date-fns/locale';
import { CalendarIcon, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Appointment = {
  id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
  status: string;
  notes?: string;
}

const formSchema = z.object({
  patient_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  session_date: z.date({ required_error: "Please select a date." }),
  session_time: z.string({ required_error: "Please select a time." }),
  session_type: z.string({ required_error: "Please select a session type." }),
  notes: z.string().optional(),
});

const SessionManagement = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const dateLocale = isRTL ? ar : enUS;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_name: "",
      session_date: undefined,
      session_time: "",
      session_type: "",
      notes: "",
    },
  });

  // Fetch doctor's appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_id', user.id)
          .order('session_date', { ascending: true });
        
        if (error) {
          console.error("Error fetching appointments:", error);
          toast.error(t('error_loading_appointments'));
          return;
        }
        
        if (data) {
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error in appointments fetch:", error);
        toast.error(t('error_loading_appointments'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, t]);

  // Filter appointments based on search query and active tab
  useEffect(() => {
    let filtered = appointments;
    
    // Filter by status
    if (activeTab === "upcoming") {
      filtered = filtered.filter((apt) => apt.status === "scheduled");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((apt) => apt.status === "completed");
    } else if (activeTab === "cancelled") {
      filtered = filtered.filter((apt) => apt.status === "cancelled");
    }
    
    // Filter by search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => 
        apt.patient_name.toLowerCase().includes(query) || 
        apt.session_type.toLowerCase().includes(query)
      );
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, activeTab]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Combine date and time to create ISO date string
      const dateTimeValue = new Date(values.session_date);
      const [hours, minutes] = values.session_time.split(':').map(Number);
      dateTimeValue.setHours(hours, minutes);
      
      // Create new appointment in Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: user.id,
          patient_id: user.id, // This should be replaced with actual patient ID
          patient_name: values.patient_name,
          session_date: dateTimeValue.toISOString(),
          session_type: values.session_type,
          notes: values.notes,
        })
        .select();
      
      if (error) {
        console.error("Error creating appointment:", error);
        toast.error(t('error_creating_appointment'));
        return;
      }
      
      // Add the new appointment to the list
      if (data && data.length > 0) {
        setAppointments([...appointments, data[0]]);
      }
      
      toast.success(t('appointment_created'));
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error in appointment creation:", error);
      toast.error(t('error_creating_appointment'));
    } finally {
      setIsSaving(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error("Error updating appointment:", error);
        toast.error(t('error_updating_appointment'));
        return;
      }
      
      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      ));
      
      toast.success(t('appointment_updated'));
    } catch (error) {
      console.error("Error in appointment update:", error);
      toast.error(t('error_updating_appointment'));
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>{t('session_management')}</CardTitle>
            <CardDescription>{t('manage_your_therapy_sessions')}</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>{t('schedule_session')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('schedule_new_session')}</DialogTitle>
                <DialogDescription>
                  {t('enter_session_details_below')}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="patient_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('patient_name')}</FormLabel>
                        <FormControl>
                          <Input {...field} className={isRTL ? 'text-right' : 'text-left'} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="session_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('date')}</FormLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start ${field.value ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP", { locale: dateLocale })
                                ) : (
                                  <span>{t('pick_a_date')}</span>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                locale={dateLocale}
                              />
                            </DialogContent>
                          </Dialog>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="session_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('time')}</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="session_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('session_type')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('select_session_type')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="initial">
                              {t('initial_consultation')}
                            </SelectItem>
                            <SelectItem value="followup">
                              {t('follow_up')}
                            </SelectItem>
                            <SelectItem value="therapy">
                              {t('therapy_session')}
                            </SelectItem>
                            <SelectItem value="assessment">
                              {t('assessment')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('notes')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('session_notes_placeholder')}
                            className={isRTL ? 'text-right' : 'text-left'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('saving')}
                        </>
                      ) : (
                        t('save')
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
                <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
                <TabsTrigger value="cancelled">{t('cancelled')}</TabsTrigger>
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-64">
              <Search className={`absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-muted-foreground`} />
              <Input
                placeholder={t('search_sessions')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 ${isRTL ? 'text-right pr-9 pl-4' : 'text-left pl-9 pr-4'}`}
              />
            </div>
          </div>
          
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('no_sessions_found')}</p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className={appointment.status === "cancelled" ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{appointment.patient_name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            appointment.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                            appointment.status === "completed" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {format(parseISO(appointment.session_date), "PPpp", { locale: dateLocale })}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">{t('session_type')}:</span> {
                            appointment.session_type === "initial" ? t('initial_consultation') :
                            appointment.session_type === "followup" ? t('follow_up') :
                            appointment.session_type === "therapy" ? t('therapy_session') :
                            appointment.session_type === "assessment" ? t('assessment') :
                            appointment.session_type
                          }
                        </p>
                        {appointment.notes && (
                          <p className="text-sm">
                            <span className="font-medium">{t('notes')}:</span> {appointment.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-row sm:flex-col gap-2 justify-end">
                        {appointment.status === "scheduled" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            >
                              {t('mark_completed')}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            >
                              {t('cancel')}
                            </Button>
                          </>
                        )}
                        {appointment.status === "cancelled" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, "scheduled")}
                          >
                            {t('reschedule')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
