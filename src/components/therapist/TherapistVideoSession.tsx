
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Video, VideoOff, Mic, MicOff, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const TherapistVideoSession = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Video call state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [upcomingSession, setUpcomingSession] = useState<any>(null);

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // WebRTC states
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Fetch upcoming session
  useEffect(() => {
    const fetchUpcomingSession = async () => {
      if (!user) return;

      try {
        const now = new Date();
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_id', user.id)
          .eq('status', 'scheduled')
          .gte('session_date', now.toISOString())
          .order('session_date', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching upcoming session:", error);
        }
        
        if (data) {
          setUpcomingSession(data);
        }
      } catch (error) {
        console.error("Error fetching upcoming session:", error);
      }
    };

    fetchUpcomingSession();
  }, [user]);

  // Initialize WebRTC
  const initializeWebRTC = async () => {
    try {
      setIsConnecting(true);
      
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
        description: upcomingSession ? 
          `${t('session_with')} ${upcomingSession.patient_name}` : 
          t('session_active'),
      });
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      setIsConnecting(false);
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
        {isSessionActive ? (
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
              {upcomingSession ? (
                <p>{t('session_with')} <strong>{upcomingSession.patient_name}</strong></p>
              ) : (
                <p>{t('live_session')}</p>
              )}
            </div>
          </div>
        ) : isConnecting ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>{t('connecting')}</p>
          </div>
        ) : upcomingSession ? (
          <div className="space-y-6 py-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">{t('upcoming_session')}</h3>
              <p className="text-primary text-2xl font-semibold">
                {upcomingSession.patient_name}
              </p>
              <p>
                {format(new Date(upcomingSession.session_date), 'PPP')} {t('at')} {format(new Date(upcomingSession.session_date), 'p')}
              </p>
              <p className="text-sm text-muted-foreground">
                {upcomingSession.session_type}
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={initializeWebRTC}>
                {t('join_session')}
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <h4 className="font-medium">{t('session_tips')}</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('quiet_environment')}</p>
                <p className="text-xs text-muted-foreground">{t('find_quiet_space_tip')}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('test_equipment')}</p>
                <p className="text-xs text-muted-foreground">{t('test_equipment_tip')}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('be_prepared')}</p>
                <p className="text-xs text-muted-foreground">{t('be_prepared_tip')}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">{t('no_scheduled_session')}</h3>
            <p className="text-muted-foreground mb-6">{t('please_schedule_session_first')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistVideoSession;
