
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";
import UserTab from "./UserTab";
import { useMessaging } from "@/hooks/useMessaging";
import { Patient } from "@/components/search/PatientSearch";
import { useLanguage } from "@/hooks/useLanguage";

interface MessagingLayoutProps {
  isTherapist?: boolean;
}

const MessagingLayout: React.FC<MessagingLayoutProps> = ({ isTherapist = true }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("messages");
  const [searchQuery, setSearchQuery] = useState("");
  
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
    const conversationId = await startNewConversation(patient.id);
    if (conversationId) {
      setActiveTab("messages");
    }
  };

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
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="patients" className="mt-0">
            <UserTab
              isTherapist={isTherapist}
              patients={patients}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              startNewConversation={startNewConversation}
              onPatientSelect={handlePatientSelect}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default MessagingLayout;
