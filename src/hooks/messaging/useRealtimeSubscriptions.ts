
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/lib/therapist-types";

export const useRealtimeSubscriptions = (
  user: any,
  activeConversationId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  updateConversationTimestamp: (conversationId: string) => void,
  fetchConversations: () => void
) => {
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        payload => {
          const newMessage = payload.new as any;
          
          // Only add message to state if it's for the active conversation
          if (newMessage.conversation_id === activeConversationId) {
            // Convert to our Message type
            const formattedMessage: Message = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_id === user.id ? (user.name || "You") : "Unknown",
              senderRole: newMessage.sender_id === user.id ? (user.role || "unknown") : "unknown",
              recipientId: "", // We'll determine this from conversation participants
              content: newMessage.content,
              timestamp: newMessage.created_at,
              isRead: true // New messages are considered read if they're in the active conversation
            };
            
            setMessages(prevMessages => [...prevMessages, formattedMessage]);
          }
          
          // Update conversation last timestamp
          updateConversationTimestamp(newMessage.conversation_id);
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
  }, [user, activeConversationId, setMessages, updateConversationTimestamp, fetchConversations]);
};
