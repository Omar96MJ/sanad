
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

    console.log("Setting up realtime subscriptions for user:", user.id);

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        async payload => {
          const newMessage = payload.new as any;
          console.log("New message received:", newMessage);
          
          // Only add message to state if it's for the active conversation
          if (newMessage.conversation_id === activeConversationId) {
            // Get sender profile info
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, role')
              .eq('id', newMessage.sender_id)
              .single();
            
            // Convert to our Message type
            const formattedMessage: Message = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: profileData?.name || "Unknown",
              senderRole: profileData?.role || "unknown",
              recipientId: "",
              content: newMessage.content,
              timestamp: newMessage.created_at,
              isRead: true
            };
            
            console.log("Adding formatted message to state:", formattedMessage);
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
          console.log("Conversation updated, refreshing list");
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      console.log("Cleaning up realtime subscriptions");
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, activeConversationId, setMessages, updateConversationTimestamp, fetchConversations]);
};
