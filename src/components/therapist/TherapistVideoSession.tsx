
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Video, VideoOff, Mic, MicOff, Phone, Calendar, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Appointment {
  id: string;
  patient_id: string;
  session_date: string;
  session_type: string;
  status: string;
  notes?: string;
  patient_name?: string;
  patient_profile_image?: string;
}

const TherapistVideoSession = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Video call state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeSessionAppointment, setActiveSessionAppointment] = useState<Appointment | null>(null);
  const [scheduledAppointments, setScheduledAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // WebRTC states
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Fetch scheduled appointments
  useEffect(() => {
    const fetchScheduledAppointments = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // First get the doctor profile to get the doctor ID
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (doctorError) {
          console.error("Error fetching doctor profile:", doctorError);
          return;
        }

        // Fetch scheduled appointments with patient details
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            profiles!appointments_patient_id_fkey (
              name,
              profile_image
            )
          `)
          .eq('doctor_id', doctorData.id)
          .eq('status', 'scheduled')
          .order('session_date', { ascending: true });

        if (error) {
          console.error("Error fetching appointments:", error);
          return;
        }

        if (data) {
          const mappedAppointments: Appointment[] = data.map(apt => ({
            id: apt.id,
            patient_id: apt.patient_id,
            session_date: apt.session_date,
            session_type: apt.session_type,
            status: apt.status,
            notes: apt.notes,
            patient_name: apt.profiles?.name || 'Unknown Patient',
            patient_profile_image: apt.profiles?.profile_image
          }));
          setScheduledAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduledAppointments();
  }, [user]);

  // Initialize WebRTC for a specific appointment
  const initializeWebRTC = async (appointment: Appointment) => {
    try {
      setIsConnecting(true);
      setActiveSessionAppointment(appointment);
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Create peer connection
      const configuration = { 
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ] 
      };
      
      peerConnectionRef.current = new RTCPeerConnection(configuration);
      
      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });
      
      // Handle remote tracks
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      setIsSessionActive(true);
      setIsConnecting(false);
      
      toast({
        title: t('session_joined'),
        description: `${t('session_with')} ${appointment.patient_name}`,
      });
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      setIsConnecting(false);
      setActiveSessionAppointment(null);
      toast({
        title: t('error_starting_session'),
        variant: "destructive",
      });
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
      
      toast({
        title: !isVideoEnabled ? t('video_enabled') : t('video_disabled'),
        description: !isVideoEnabled ? '' : t('audio_only_mode'),
      });
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // End session
  const endSession = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setIsSessionActive(false);
    setActiveSessionAppointment(null);
    
    toast({
      title: t('session_ended'),
      description: t('session_summary_email'),
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('video_session')}</CardTitle>
        <CardDescription>{t('manage_your_therapy_sessions')}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isSessionActive && activeSessionAppointment ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                {/* Remote video (patient) */}
                <video 
                  ref={remoteVideoRef} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  playsInline
                ></video>
              </div>
              
              {/* Local video (therapist) */}
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video 
                  ref={localVideoRef} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  playsInline 
                  muted
                ></video>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant={isVideoEnabled ? "default" : "outline"} 
                onClick={toggleVideo}
                className="rounded-full p-3 h-12 w-12"
              >
                {isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
              </Button>
              
              <Button 
                variant={isAudioEnabled ? "default" : "outline"} 
                onClick={toggleAudio}
                className="rounded-full p-3 h-12 w-12"
              >
                {isAudioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={endSession}
                className="rounded-full p-3 h-12 w-12"
              >
                <Phone size={18} className="rotate-135" />
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>{t('session_with')} <strong>{activeSessionAppointment.patient_name}</strong></p>
            </div>
          </div>
        ) : isConnecting ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>{t('connecting')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">{t('scheduled_sessions')}</h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : scheduledAppointments.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">{t('no_scheduled_session')}</h3>
                <p className="text-muted-foreground mb-6">{t('please_schedule_session_first')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={appointment.patient_profile_image} alt={appointment.patient_name} />
                          <AvatarFallback>
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg">{appointment.patient_name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(appointment.session_date), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{format(new Date(appointment.session_date), 'p')}</span>
                            </div>
                          </div>
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
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">{t('notes')}:</span> {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => initializeWebRTC(appointment)}
                        className="flex items-center gap-2"
                      >
                        <Video size={16} />
                        {t('start_session')}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistVideoSession;
