
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Video, VideoOff, Webcam } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TherapistVideoSession = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [upcomingSession, setUpcomingSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  
  useEffect(() => {
    const fetchUpcomingSession = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Fetch the closest upcoming session for the therapist
        const { data, error } = await supabase
          .from('appointments')
          .select('*, patient:patient_id(*)')
          .eq('doctor_id', user.id)
          .eq('status', 'scheduled')
          .gte('session_date', new Date().toISOString())
          .order('session_date', { ascending: true })
          .limit(1);
          
        if (error) {
          console.error("Error fetching upcoming session:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setUpcomingSession(data[0]);
        }
      } catch (error) {
        console.error("Error in fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpcomingSession();
    
    // Set up realtime subscription for session updates
    const channel = supabase
      .channel('public:appointments')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'appointments',
          filter: `doctor_id=eq.${user?.id}`
        }, 
        (payload) => {
          // Refresh the session data when there's an update
          fetchUpcomingSession();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
      // Clean up WebRTC connections
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [user]);

  const setupWebRTC = async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoEnabled, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      localStreamRef.current = stream;
      
      // Create and configure peer connection
      const configuration = { 
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ] 
      };
      
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;
      
      // Add local tracks to the connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
      
      // Set up event handlers for peer connection
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Listen for signaling through Supabase Realtime
      const channel = supabase.channel(`video-session-${upcomingSession.id}`);
      
      channel.on('broadcast', { event: 'offer' }, async (payload) => {
        if (payload.payload.sender !== user?.id) {
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.payload.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            
            channel.send({
              type: 'broadcast',
              event: 'answer',
              payload: {
                answer,
                sender: user?.id
              }
            });
          } catch (error) {
            console.error("Error handling offer:", error);
            toast.error(t("error_connecting_to_session"));
          }
        }
      });
      
      channel.on('broadcast', { event: 'answer' }, async (payload) => {
        if (payload.payload.sender !== user?.id) {
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.payload.answer));
          } catch (error) {
            console.error("Error handling answer:", error);
          }
        }
      });
      
      channel.on('broadcast', { event: 'ice-candidate' }, async (payload) => {
        if (payload.payload.sender !== user?.id) {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(payload.payload.candidate));
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        }
      });
      
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          channel.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              candidate: event.candidate,
              sender: user?.id
            }
          });
        }
      };
      
      channelRef.current = channel;
      await channel.subscribe();
      
      // If the therapist is the one initiating
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      channel.send({
        type: 'broadcast',
        event: 'offer',
        payload: {
          offer,
          sender: user?.id
        }
      });
      
      toast.success(t("session_joined"));
    } catch (error) {
      console.error("Error setting up WebRTC:", error);
      toast.error(t("error_connecting_to_session"));
    }
  };

  const handleStartSession = async () => {
    try {
      await setupWebRTC();
      setIsSessionActive(true);
      
      // Update session status in the database
      if (upcomingSession) {
        const { error } = await supabase
          .from('appointments')
          .update({ status: 'in-progress' })
          .eq('id', upcomingSession.id);
          
        if (error) {
          console.error("Error updating session status:", error);
        }
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast.error(t("error_starting_session"));
    }
  };

  const handleEndSession = async () => {
    try {
      // Stop all media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      
      // Clean up Supabase channel
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
      }
      
      setIsSessionActive(false);
      toast.info(t("session_ended"));
      
      // Update session status in the database
      if (upcomingSession) {
        const { error } = await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', upcomingSession.id);
          
        if (error) {
          console.error("Error updating session status:", error);
        }
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const toggleVideo = async () => {
    try {
      if (localStreamRef.current) {
        const videoTracks = localStreamRef.current.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = !isVideoEnabled;
        });
        setIsVideoEnabled(!isVideoEnabled);
        
        toast.info(isVideoEnabled ? t("video_disabled") : t("video_enabled"));
      }
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  };

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('video_session')}</CardTitle>
        <CardDescription>
          {isSessionActive 
            ? t('live_session')
            : t('manage_your_therapy_sessions')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-center space-y-2">
              <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
            </div>
          </div>
        ) : isSessionActive ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
              <div className="relative bg-black/10 rounded-md overflow-hidden">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
                  {t('you')}
                </div>
              </div>
              
              <div className="relative bg-black/10 rounded-md overflow-hidden">
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
                  {upcomingSession?.patient?.name || t('patient')}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={toggleVideo}
              >
                {isVideoEnabled ? (
                  <>
                    <VideoOff className="h-4 w-4" />
                    <span>{t('disable_video')}</span>
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    <span>{t('enable_video')}</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleEndSession}
              >
                <Webcam className="h-4 w-4" />
                <span>{t('end_call')}</span>
              </Button>
            </div>
          </div>
        ) : upcomingSession ? (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <h3 className="text-lg font-semibold">
                {t('upcoming_session')}
              </h3>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('patient_name')}:</span>
                  <span className="font-medium">{upcomingSession.patient?.name || '-'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('date')}:</span>
                  <span className="font-medium">{formatSessionDate(upcomingSession.session_date)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('time')}:</span>
                  <span className="font-medium">{formatSessionTime(upcomingSession.session_date)}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-center">
                  <Button onClick={handleStartSession}>
                    {t('join_session')}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t('session_tips')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium">{t('quiet_environment')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('find_quiet_space_tip')}
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium">{t('test_equipment')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('test_equipment_tip')}
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h4 className="font-medium">{t('be_prepared')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('be_prepared_tip')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Webcam className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">{t('no_scheduled_sessions')}</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {t('schedule_session_to_start')}
            </p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => document.querySelector('[data-value="sessions"]')?.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
              )}
            >
              {t('schedule_session')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistVideoSession;
