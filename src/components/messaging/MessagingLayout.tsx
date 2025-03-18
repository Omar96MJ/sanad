
import React, { useState, useEffect } from "react";
import { Message, Conversation } from "@/lib/therapist-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle } from "lucide-react";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "@/hooks/useAuth";
import { mockMessages, mockConversations } from "@/models/messages-data";
import { mockPatients } from "@/models/evaluation-forms-data";
import { toast } from "sonner";

interface MessagingLayoutProps {
  isTherapist?: boolean;
}

const MessagingLayout: React.FC<MessagingLayoutProps> = ({ isTherapist = true }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [patients] = useState(mockPatients);

  useEffect(() => {
    // Set the first conversation as active by default if none is selected
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    // Mark messages as read
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );
    setConversations(updatedConversations);

    // Mark messages from this conversation as read
    const selectedConversation = conversations.find(c => c.id === conversationId);
    if (selectedConversation && user) {
      const updatedMessages = messages.map(msg => 
        selectedConversation.participantIds.includes(msg.senderId) && 
        msg.recipientId === user.id && 
        !msg.isRead
          ? { ...msg, isRead: true }
          : msg
      );
      setMessages(updatedMessages);
    }
  };

  const startNewConversation = (patientId: string) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(c => 
      c.participantIds.includes(patientId) && 
      c.participantIds.includes(user?.id || "")
    );

    if (existingConversation) {
      setActiveConversationId(existingConversation.id);
      setActiveTab("messages");
      return;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: `new-${Date.now()}`,
      participantIds: [user?.id || "", patientId],
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    };

    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
    setActiveTab("messages");
    toast.success("New conversation started");
  };

  const handleSendMessage = (content: string) => {
    if (!user || !activeConversationId) return;

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (!activeConversation) return;
    
    const recipientId = activeConversation.participantIds.find(id => id !== user.id) || "";
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Update messages
    setMessages([...messages, newMessage]);
    
    // Update conversation last message timestamp
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversationId 
        ? { 
            ...conv, 
            lastMessageTimestamp: newMessage.timestamp,
          } 
        : conv
    );
    setConversations(updatedConversations);
  };

  const getConversationMessages = () => {
    if (!activeConversationId || !user) return [];
    
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    if (!activeConversation) return [];
    
    return messages.filter(msg => 
      activeConversation.participantIds.includes(msg.senderId) && 
      activeConversation.participantIds.includes(msg.recipientId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : "Patient";
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeRecipientId = activeConversation?.participantIds.find(id => id !== user?.id);
  const conversationMessages = getConversationMessages();

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Messaging</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            {isTherapist && <TabsTrigger value="patients">Patients</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="messages" className="mt-0">
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
                        {activeRecipientId ? getPatientName(activeRecipientId) : "Conversation"}
                      </h3>
                    </div>
                    
                    <MessageList
                      messages={conversationMessages}
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
          </TabsContent>
          
          {isTherapist && (
            <TabsContent value="patients" className="mt-0">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
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
                          <p className="text-xs text-muted-foreground">Patient</p>
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
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default MessagingLayout;
