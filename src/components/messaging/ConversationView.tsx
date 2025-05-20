
import React from "react";
import { Message, Conversation } from "@/lib/therapist-types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useLanguage } from "@/hooks/useLanguage";

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
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeRecipientId = activeConversation?.participantIds.find(id => id !== currentUserId);
  
  if (!activeConversationId) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        {t('select_conversation') || "Select a conversation to start messaging"}
      </div>
    );
  }
  
  return (
    <>
      <div className="border-b border-border/50 pb-4 mb-4">
        <h3 className="font-medium">
          {activeRecipientId ? (
            patients.find(p => p.id === activeRecipientId)?.name || t('conversation') || "Conversation"
          ) : (
            t('conversation') || "Conversation"
          )}
        </h3>
      </div>
      
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
      />
      
      <MessageInput onSendMessage={onSendMessage} />
    </>
  );
};

export default ConversationView;
