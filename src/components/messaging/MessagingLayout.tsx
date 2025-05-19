import React, { useState, useEffect } from "react";
import { Message, Conversation } from "@/lib/therapist-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PatientSearch, Patient } from "@/components/search/PatientSearch";

interface MessagingLayoutProps {
  isTherapist?: boolean;
}

const MessagingLayout: React.FC<MessagingLayoutProps> = ({ isTherapist = true }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch conversations and messages
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // Get conversations where the current user is a participant
        const { data: participantData, error: participantError } = await supabase
          .from('conversation_participants')
          .select('conversation_id, unread_count')
          .eq('user_id', user.id);
          
        if (participantError) {
          console.error("Error fetching conversations:", participantError);
          return;
        }
        
        if (!participantData || participantData.length === 0) {
          setIsLoading(false);
          return;
        }
        
        const conversationIds = participantData.map(p => p.conversation_id);
        
        // Get conversation details
        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .in('id', conversationIds)
          .order('updated_at', { ascending: false });
          
        if (conversationError) {
          console.error("Error fetching conversation details:", conversationError);
          return;
        }
        
        // Get all participants for these conversations
        const { data: allParticipants, error: allParticipantsError } = await supabase
          .from('conversation_participants')
          .select('conversation_id, user_id')
          .in('conversation_id', conversationIds);
          
        if (allParticipantsError) {
          console.error("Error fetching all participants:", allParticipantsError);
          return;
        }
        
        // Build conversations with participant IDs
        const conversationsWithParticipants: Conversation[] = conversationData.map(conv => {
          const participants = allParticipants
            .filter(p => p.conversation_id === conv.id)
            .map(p => p.user_id);
            
          const unreadCount = participantData.find(p => p.conversation_id === conv.id)?.unread_count || 0;
          
          return {
            id: conv.id,
            participantIds: participants,
            lastMessageTimestamp: conv.updated_at,
            unreadCount
          };
        });
        
        setConversations(conversationsWithParticipants);
        
        // If we have at least one conversation, set it as active
        if (conversationsWithParticipants.length > 0 && !activeConversationId) {
          setActiveConversationId(conversationsWithParticipants[0].id);
        }
      } catch (error) {
        console.error("Error in conversation fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchPatients = async () => {
      try {
        if (isTherapist) {
          // This is now handled by the PatientSearch component
          // We'll still fetch some initial patients for the list
          const { data, error } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('role', 'patient')
            .limit(10)
            .order('name');
            
          if (!error && data) {
            setPatients(data.map(patient => ({
              id: patient.id,
              name: patient.name || 'Unknown Patient'
            })));
          }
        } else {
          // Fetch doctors if user is a patient
          const { data, error } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('role', 'doctor');
            
          if (!error && data) {
            setPatients(data.map(doctor => ({
              id: doctor.id,
              name: doctor.name || 'Unknown Doctor'
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching patients/doctors:", error);
      }
    };
    
    fetchConversations();
    fetchPatients();
    
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        payload => {
          const newMessage = payload.new as Message;
          
          // Only add message to state if it's relevant to current user
          if (newMessage.senderId === user.id || newMessage.recipientId === user.id) {
            setMessages(prevMessages => [...prevMessages, newMessage]);
            
            // Update unread count in conversations if message is received
            if (newMessage.recipientId === user.id && !newMessage.isRead) {
              updateUnreadCount(newMessage);
            }
          }
        }
      )
      .subscribe();
      
    // Subscribe to conversation updates
    const conversationsChannel = supabase
      .channel('public:conversations')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'conversations' }, 
        () => {
          // Refresh conversations when updated
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, isTherapist, activeConversationId]);
  
  // Fetch messages for active conversation
  useEffect(() => {
    if (!user || !activeConversationId) return;
    
    const fetchMessages = async () => {
      const activeConversation = conversations.find(c => c.id === activeConversationId);
      if (!activeConversation) return;
      
      const otherParticipantId = activeConversation.participantIds.find(id => id !== user.id);
      if (!otherParticipantId) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .or(`sender_id.eq.${otherParticipantId},recipient_id.eq.${otherParticipantId}`)
          .order('timestamp', { ascending: true });
          
        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }
        
        if (data) {
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            senderName: "", // We'll populate this below
            senderRole: "", // We'll populate this below
            recipientId: msg.recipient_id,
            content: msg.content,
            timestamp: msg.timestamp,
            isRead: msg.is_read
          }));
          
          // Mark messages as read
          const unreadMessages = data.filter(
            msg => msg.recipient_id === user.id && !msg.is_read
          );
          
          if (unreadMessages.length > 0) {
            const messageIds = unreadMessages.map(msg => msg.id);
            
            await supabase
              .from('messages')
              .update({ is_read: true })
              .in('id', messageIds);
              
            // Reset unread count for this conversation
            await supabase
              .from('conversation_participants')
              .update({ unread_count: 0 })
              .eq('conversation_id', activeConversationId)
              .eq('user_id', user.id);
          }
          
          // Get user profiles to populate sender names
          const userIds = Array.from(
            new Set([
              ...formattedMessages.map(msg => msg.senderId),
              ...formattedMessages.map(msg => msg.recipientId)
            ])
          );
          
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, role')
            .in('id', userIds);
            
          if (!profilesError && profilesData) {
            const userProfiles = Object.fromEntries(
              profilesData.map(profile => [profile.id, { name: profile.name, role: profile.role }])
            );
            
            const messagesWithUserInfo = formattedMessages.map(msg => ({
              ...msg,
              senderName: userProfiles[msg.senderId]?.name || 'Unknown',
              senderRole: userProfiles[msg.senderId]?.role || 'unknown'
            }));
            
            setMessages(messagesWithUserInfo);
          } else {
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error("Error in message fetch:", error);
      }
    };
    
    fetchMessages();
  }, [user, activeConversationId, conversations]);
  
  const updateUnreadCount = async (newMessage: Message) => {
    // Find conversation for this message
    const otherParticipantId = newMessage.senderId;
    
    // Find conversation with both users
    const conversation = conversations.find(conv => 
      conv.participantIds.includes(user!.id) && 
      conv.participantIds.includes(otherParticipantId)
    );
    
    if (conversation) {
      // If message belongs to active conversation, mark as read
      if (conversation.id === activeConversationId) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', newMessage.id);
      } else {
        // Otherwise increment unread count
        await supabase
          .from('conversation_participants')
          .update({ 
            unread_count: conversation.unreadCount + 1 
          })
          .eq('conversation_id', conversation.id)
          .eq('user_id', user!.id);
          
        // Update local state
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === conversation.id 
              ? { ...conv, unreadCount: conv.unreadCount + 1 }
              : conv
          )
        );
      }
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const startNewConversation = async (participantId: string) => {
    if (!user) return;
    
    // Check if conversation already exists
    const existingConversation = conversations.find(c => 
      c.participantIds.includes(participantId) && 
      c.participantIds.includes(user.id)
    );

    if (existingConversation) {
      setActiveConversationId(existingConversation.id);
      setActiveTab("messages");
      return;
    }
    
    try {
      // Create new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();
        
      if (conversationError) {
        console.error("Error creating conversation:", conversationError);
        toast.error("Failed to start new conversation");
        return;
      }
      
      // Add participants
      const participantsToAdd = [
        { conversation_id: conversationData.id, user_id: user.id },
        { conversation_id: conversationData.id, user_id: participantId }
      ];
      
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert(participantsToAdd);
        
      if (participantError) {
        console.error("Error adding participants:", participantError);
        toast.error("Failed to add participants to conversation");
        return;
      }
      
      // Create new conversation object for state
      const newConversation: Conversation = {
        id: conversationData.id,
        participantIds: [user.id, participantId],
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0
      };
      
      // Update state
      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation.id);
      setActiveTab("messages");
      toast.success("New conversation started");
    } catch (error) {
      console.error("Error in starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !activeConversationId) return;

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (!activeConversation) return;
    
    const recipientId = activeConversation.participantIds.find(id => id !== user.id);
    if (!recipientId) return;
    
    try {
      // Insert message into database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
        return;
      }
      
      // Convert the database message to our Message type
      const newMessage: Message = {
        id: data.id,
        senderId: data.sender_id,
        senderName: user.name || "",
        senderRole: user.role || "",
        recipientId: data.recipient_id,
        content: data.content,
        timestamp: data.timestamp,
        isRead: data.is_read
      };
      
      // Message will be added to state via subscription
      console.log("Message sent:", newMessage);
    } catch (error) {
      console.error("Error in send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    startNewConversation(patient.id);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeRecipientId = activeConversation?.participantIds.find(id => id !== user?.id);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Messaging</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="patients">{isTherapist ? 'Patients' : 'Doctors'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 border-r border-border/50 pr-4">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search conversations..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <ConversationList
                    conversations={conversations}
                    messages={messages}
                    patients={patients}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                    currentUserId={user?.id || ""}
                  />
                </div>
                
                <div className="md:col-span-2">
                  {activeConversationId ? (
                    <>
                      <div className="border-b border-border/50 pb-4 mb-4">
                        <h3 className="font-medium">
                          {activeRecipientId ? (
                            patients.find(p => p.id === activeRecipientId)?.name || "Conversation"
                          ) : "Conversation"}
                        </h3>
                      </div>
                      
                      <MessageList
                        messages={messages}
                        currentUserId={user?.id || ""}
                      />
                      
                      <MessageInput onSendMessage={handleSendMessage} />
                    </>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Select a conversation to start messaging
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="patients" className="mt-0">
            {isTherapist ? (
              <PatientSearch 
                onPatientSelect={handlePatientSelect}
                buttonText="Message"
              />
            ) : (
              // For non-therapists (patients), keep the existing doctor search functionality
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${isTherapist ? 'patients' : 'doctors'}...`}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${patient.id}`} alt={patient.name} />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{patient.name}</h4>
                            <p className="text-xs text-muted-foreground">{isTherapist ? 'Patient' : 'Doctor'}</p>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          size="sm"
                          onClick={() => startNewConversation(patient.id)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredPatients.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No {isTherapist ? 'patients' : 'doctors'} found
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default MessagingLayout;
