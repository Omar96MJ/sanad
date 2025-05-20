
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertTriangle } from "lucide-react";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";
import TherapistUserTab from "./TherapistUserTab";
import PatientUserTab from "./PatientUserTab";
import MessagingError from "./MessagingError";
import { useMessaging } from "@/hooks/useMessaging";
import { Patient } from "@/components/search/PatientSearch";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

interface MessagingLayoutProps {
  isTherapist?: boolean;
}

const MessagingLayout: React.FC<MessagingLayoutProps> = ({ isTherapist = true }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const {
    messages,
    conversations,
    patients,
    activeConversationId,
    isLoading,
    handleSelectConversation,
    startNewConversation,
    handleSendMessage,
    currentUser
  } = useMessaging(isTherapist);

  const handlePatientSelect = async (patient: Patient) => {
    try {
      setError(null);
      const conversationId = await startNewConversation(patient.id);
      if (conversationId) {
        setActiveTab("messages");
        toast.success(t('conversation_started') || "Conversation started");
      } else {
        setError(t('failed_start_conversation') || "Failed to start conversation");
      }
    } catch (err) {
      console.error("Error starting conversation:", err);
      setError(t('unexpected_error') || "An unexpected error occurred");
    }
  };

  const retryFetch = () => {
    setError(null);
    window.location.reload();
  };

  const handleSendMessageWithErrorHandling = async (content: string) => {
    try {
      const result = await handleSendMessage(content);
      if (!result) {
        toast.error(t('failed_send_message') || "Failed to send message");
      }
      return result;
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(t('failed_send_message') || "Failed to send message");
      return false;
    }
  };

  if (!currentUser) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>{t('messaging') || "Messaging"}</CardTitle>
        </CardHeader>
        <CardContent>
          <MessagingError 
            title={t('auth_required') || "Authentication Required"} 
            message={t('login_to_message') || "Please login to access messaging"} 
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>{t('messaging') || "Messaging"}</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="messages">{t('messages') || "Messages"}</TabsTrigger>
            <TabsTrigger value="patients">{isTherapist ? (t('patients') || "Patients") : (t('doctors') || "Doctors")}</TabsTrigger>
          </TabsList>
          
          {error && (
            <MessagingError 
              message={error}
              onRetry={retryFetch}
            />
          )}
          
          <TabsContent value="messages" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 border-r border-border/50 pr-4">
                  <ConversationList
                    conversations={conversations}
                    messages={messages}
                    patients={patients}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                    currentUserId={currentUser?.id || ""}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <ConversationView
                    activeConversationId={activeConversationId}
                    messages={messages}
                    conversations={conversations}
                    currentUserId={currentUser?.id || ""}
                    patients={patients}
                    onSendMessage={handleSendMessageWithErrorHandling}
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="patients" className="mt-0">
            {isTherapist ? (
              <TherapistUserTab onPatientSelect={handlePatientSelect} />
            ) : (
              <PatientUserTab
                doctors={patients}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                startNewConversation={startNewConversation}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default MessagingLayout;
