
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { ConversationWithParticipants } from "./types";

export const useMessagingActions = (
  user: any,
  conversations: ConversationWithParticipants[],
  setConversations: React.Dispatch<React.SetStateAction<ConversationWithParticipants[]>>
) => {
  const { t } = useLanguage();

  const startNewConversation = async (participantId: string) => {
    if (!user) {
      console.error("No user found for conversation creation");
      return null;
    }
    
    console.log("Starting conversation with participant:", participantId, "current user:", user.id);
    
    // Check if conversation already exists
    const existingConversation = conversations.find(c => 
      c.participantIds.includes(participantId) && 
      c.participantIds.includes(user.id)
    );

    if (existingConversation) {
      console.log("Existing conversation found:", existingConversation.id);
      return existingConversation.id;
    }
    
    try {
      console.log("Creating new conversation...");
      
      // Create new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();
        
      if (conversationError) {
        console.error("Error creating conversation:", conversationError);
        toast.error(t('failed_create_conversation') || "Failed to start new conversation");
        return null;
      }
      
      console.log("Conversation created:", conversationData);
      
      // Add participants
      const participantsToAdd = [
        { conversation_id: conversationData.id, user_id: user.id },
        { conversation_id: conversationData.id, user_id: participantId }
      ];
      
      console.log("Adding participants:", participantsToAdd);
      
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert(participantsToAdd);
        
      if (participantError) {
        console.error("Error adding participants:", participantError);
        toast.error(t('failed_add_participants') || "Failed to add participants to conversation");
        return null;
      }
      
      console.log("Participants added successfully");
      
      // Create new conversation object for state
      const newConversation: ConversationWithParticipants = {
        id: conversationData.id,
        participantIds: [user.id, participantId],
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0
      };
      
      // Update state
      setConversations([newConversation, ...conversations]);
      toast.success(t('conversation_started') || "New conversation started");
      return newConversation.id;
    } catch (error) {
      console.error("Error in starting conversation:", error);
      toast.error(t('failed_start_conversation') || "Failed to start conversation");
      return null;
    }
  };

  const handleSendMessage = async (content: string, activeConversationId: string | null): Promise<boolean> => {
    if (!user || !activeConversationId) {
      console.error("Missing user or conversation ID for message sending");
      return false;
    }
    
    console.log("Sending message:", { content, conversationId: activeConversationId, senderId: user.id });
    
    try {
      // Insert message into database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          conversation_id: activeConversationId,
          content
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error sending message:", error);
        toast.error(t('failed_send_message') || "Failed to send message");
        return false;
      }
      
      console.log("Message sent successfully:", data);
      return true;
    } catch (error) {
      console.error("Error in send message:", error);
      toast.error(t('failed_send_message') || "Failed to send message");
      return false;
    }
  };

  return {
    startNewConversation,
    handleSendMessage
  };
};
