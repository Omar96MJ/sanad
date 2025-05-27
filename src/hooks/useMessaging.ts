
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { useConversations } from "./messaging/useConversations";
import { useMessages } from "./messaging/useMessages";
import { useUsers } from "./messaging/useUsers";
import { useRealtimeSubscriptions } from "./messaging/useRealtimeSubscriptions";
import { useMessagingActions } from "./messaging/useMessagingActions";
import { MessagingHookReturn } from "./messaging/types";

export const useMessaging = (isTherapist: boolean = true): MessagingHookReturn => {
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const { conversations, isLoading, fetchConversations, updateConversationTimestamp, setConversations } = useConversations(user);
  const { messages, setMessages } = useMessages(user, activeConversationId);
  const { patients } = useUsers(isTherapist);
  
  // Set initial active conversation
  if (conversations.length > 0 && !activeConversationId) {
    setActiveConversationId(conversations[0].id);
  }

  const { startNewConversation, handleSendMessage: sendMessage } = useMessagingActions(
    user,
    conversations,
    setConversations
  );

  useRealtimeSubscriptions(
    user,
    activeConversationId,
    setMessages,
    updateConversationTimestamp,
    fetchConversations
  );

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleSendMessage = async (content: string): Promise<boolean> => {
    return sendMessage(content, activeConversationId);
  };

  return {
    messages,
    conversations,
    patients,
    activeConversationId,
    isLoading,
    handleSelectConversation,
    startNewConversation,
    handleSendMessage,
    currentUser: user,
  };
};
