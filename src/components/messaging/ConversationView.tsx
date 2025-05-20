
import React, { useState } from "react";
import { Message, Conversation } from "@/lib/therapist-types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useLanguage } from "@/hooks/useLanguage";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConversationViewProps {
  activeConversationId: string | null;
  messages: Message[];
  conversations: Conversation[];
  currentUserId: string;
  patients: any[];
  onSendMessage: (content: string) => Promise<boolean>;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  activeConversationId,
  messages,
  conversations,
  currentUserId,
  patients,
  onSendMessage
}) => {
  const { t } = useLanguage();
  const [sendError, setSendError] = useState<string | null>(null);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeRecipientId = activeConversation?.participantIds.find(id => id !== currentUserId);
  const activeRecipient = activeRecipientId ? patients.find(p => p.id === activeRecipientId) : null;
  
  const handleSendMessage = async (content: string) => {
    try {
      setSendError(null);
      const result = await onSendMessage(content);
      if (!result) {
        setSendError(t('failed_send_message') || "Failed to send message");
      }
      return result;
    } catch (error) {
      console.error("Error sending message:", error);
      setSendError(t('failed_send_message') || "Failed to send message");
      return false;
    }
  };
  
  if (!activeConversationId) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
        <div className="p-6 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground opacity-40 mb-2" />
          <p>{t('select_conversation') || "Select a conversation to start messaging"}</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="border-b border-border/50 pb-4 mb-4">
        <h3 className="font-medium">
          {activeRecipient ? (
            activeRecipient.name || t('conversation') || "Conversation"
          ) : (
            t('conversation') || "Conversation"
          )}
        </h3>
      </div>
      
      {sendError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{sendError}</AlertDescription>
        </Alert>
      )}
      
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
      />
      
      <MessageInput onSendMessage={handleSendMessage} />
    </>
  );
};

export default ConversationView;
